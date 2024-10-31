import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
function RTE({name,control,label,defaultvalue=""}){
    return(
        <>
        <div className='w-full'>
            {label && <label className="inline-block mb-1 pl-1 bg-black">{label}</label>}
            <Controller
            name={name || "content"}
            control={control}
            render={({field:{onChange}})=>(
                <Editor
                apiKey="qg5cuwtgqh0txe6w1xu3kis719lfwovpydkzglqvg331fudn"
                initialValue={defaultvalue}
                height={500}
                menubar={true}
                //readonly={false}
                plugins={[
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "anchor",
                ]}
                toolbar={
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help"}
                content_style={"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"}
                onEditorChange={onChange}
                />
            )}
            />
        </div>
        
        </>
    )
}

export default RTE;