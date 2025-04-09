
const uploadService = {
    toBase64: (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    },

    uploadToCloudinary: async (base64Image: string): Promise<string> => {
        const formData = new FormData();

        formData.append("file", base64Image);
        formData.append("upload_preset", "shopsphere");
        formData.append("cloud_name", "dok7eq77l");

        const response = await fetch("https://api.cloudinary.com/v1_1/dok7eq77l/image/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (data.secure_url) {
            return data.secure_url;
        } else {
            throw new Error("Upload failed: " + JSON.stringify(data));
        }
    },
};

export default uploadService;
