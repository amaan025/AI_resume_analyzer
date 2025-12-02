// app/lib/pdf2img.ts
export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

// cache the loaded library between calls
let pdfjsLib: any | null = null;

async function getPdfJs() {
    if (pdfjsLib) return pdfjsLib;

    if (typeof window === "undefined") {
        throw new Error("PDF conversion can only run in the browser");
    }

    // Dynamically import pdfjs only in the browser
    const lib = await import("pdfjs-dist");
    const workerSrcModule = await import(
        "pdfjs-dist/build/pdf.worker.mjs?url"
        );

    // Configure worker with matching version
    (lib as any).GlobalWorkerOptions.workerSrc = workerSrcModule.default;

    pdfjsLib = lib;
    return lib;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        // Extra safety: don't run during SSR
        if (typeof window === "undefined" || typeof document === "undefined") {
            return {
                imageUrl: "",
                file: null,
                error: "PDF conversion can only run in the browser",
            };
        }

        const lib = await getPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await (lib as any)
            .getDocument({ data: arrayBuffer })
            .promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 4 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";
        } else {
            return {
                imageUrl: "",
                file: null,
                error: "Failed to get 2D canvas context",
            };
        }

        // pdf.js v5 requires `canvas` in the render parameters
        await page
            .render({
                canvasContext: context,
                canvas,
                viewport,
            })
            .promise;

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const baseName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${baseName}.png`, {
                            type: "image/png",
                        });

                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                    }
                },
                "image/png",
                1.0
            );
        });
    } catch (err) {
        console.error("convertPdfToImage failed:", err);
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err}`,
        };
    }
}
