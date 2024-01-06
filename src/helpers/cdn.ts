import { BlobServiceClient } from "@azure/storage-blob";

async function uploadImage() {
  const connectionString = "DefaultEndpointsProtocol=https;AccountName=talkstuffstore;AccountKey=4F7Cop5iTJA==;EndpointSuffix=core.windows.net";
  const containerName = "csi-iis/TalkStuffAdmin";
  const blobName = "test.jpg"; 
  const localFilePath = "";

  // Create a BlobServiceClient
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const uploadResponse = await blockBlobClient.uploadFile(localFilePath);

  console.log("Image uploaded:", uploadResponse.requestId);
}

export default uploadImage