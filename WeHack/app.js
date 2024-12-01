document.getElementById("uploadForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];
    const loading = document.getElementById("loading");
    const output = document.getElementById("output");
    const outputImage = document.getElementById("outputImage");
    const downloadBtn = document.getElementById("downloadBtn");

    if (!file) {
        alert("Please select an image first.");
        return;
    }

    // Validate file type and size
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (!allowedFormats.includes(file.type)) {
        alert("Only JPG, PNG, or WebP formats are supported.");
        return;
    }

    if (file.size > maxSize) {
        alert("File size exceeds 10 MB.");
        return;
    }

    // Show loading indicator
    loading.classList.remove("hidden");
    output.classList.add("hidden");
    downloadBtn.classList.add("hidden");

    const formData = new FormData();
    formData.append("image_file", file);

    try {
        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
                "X-Api-Key": "UovrzBVtuBt32zfhoVNnVVzw", // Replace with your API key
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errors[0].title);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Update UI with the processed image
        outputImage.src = url;

        // Show output and enable download
        loading.classList.add("hidden");
        output.classList.remove("hidden");
        downloadBtn.classList.remove("hidden");

        // Set up download functionality
        downloadBtn.onclick = () => {
            const link = document.createElement("a");
            link.href = url;
            link.download = "removed-background.png";
            link.click();
        };
    } catch (error) {
        loading.classList.add("hidden");
        alert(
            error.message.includes("identify foreground")
                ? "Could not identify the foreground. Please use an image with a clear subject."
                : "Error: " + error.message
        );
    }
});
