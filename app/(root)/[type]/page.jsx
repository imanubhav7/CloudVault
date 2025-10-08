import { getFiles } from "@/action/file-action";
import Card from "@/app/component/Card";
import Sort from "@/app/component/Sort";
import React from "react";

const Page = async ({ params }) => {
  const type = (await params)?.type || " ";

    const files = await getFiles();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="flex mt-2 flex-col justify-between sm:flex-row sm:items-center">
          <p>
            Total : <span className="font-bold">0 MB</span>
          </p>
          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>

      {/* Render files  */}
        {files.total > 0 ? (
            <section className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
               {files.documents.map((file)=> (
              <Card key={file.$id} file={file} />
               ) )}
            </section>
        ): <p> No files Uploaded </p>}
    </div>
  );
};

export default Page;
