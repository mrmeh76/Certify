import { createUploadthing, type FileRouter } from "uploadthing/next";
const f = createUploadthing();
  
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ metadata, file }) => { 
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { fileURL: file.ufsUrl };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;