This branch implements the core image-to-AI analysis pipeline:

Handles client image uploads via multipart/form-data.

Converts the image to Base64.

Calls the Google Cloud Vision API for raw Label and Text (OCR) analysis.
