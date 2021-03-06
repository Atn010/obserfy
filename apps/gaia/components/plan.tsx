import React, { FC } from "react"
import Button from "./button"
import PaperclipIcon from "../icons/paperclip.svg"

interface Props {
  name: string
  area: string
  files: Array<{
    link: string
    name: string
  }>
}
const Plan: FC<Props> = ({ name, area, files }) => {
  return (
    <div>
      <div className="flex flex-col items-start bg-surface px-3 pt-3  pb-2 rounded shadow mb-2">
        <div className="text-md">{name}</div>
        <div className="text-sm text-green-700 mb-3">{area}</div>
        {files.length > 0 && (
          <div className="text-sm text-gray-700 mb-1">Files</div>
        )}
        {files.map(() => (
          <File />
        ))}
      </div>
    </div>
  )
}

const File = () => {
  return (
    <div className="flex items-center py-1 text-sm">
      <Button className="py-1 px-1 mr-3" outline>
        <img alt="attachment icon" src={PaperclipIcon} />
      </Button>
      First-file.pdf
    </div>
  )
}

export default Plan
