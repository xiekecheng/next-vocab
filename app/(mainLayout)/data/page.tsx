"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as XLSX from "xlsx"

export default function DataImportPage() {
  const [excelData, setExcelData] = useState<{ [key: string]: string }[]>([])
  // const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  // 解析 Excel
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    // setFile(f)
    const reader = new FileReader()
    reader.onload = (evt) => {
      const data = evt.target?.result
      const workbook = XLSX.read(data, { type: "binary" })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet)
      setExcelData(json as { [key: string]: string }[])
    }
    reader.readAsBinaryString(f)
  }

  // 提交到后端
  const handleImport = async () => {
    if (!excelData.length) return
    setLoading(true)
    const res = await fetch("/api/words/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ words: excelData }),
    })
    const data = await res.json()
    setResult(data.message)
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">导入单词 Excel 文件</h1>
      <Input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      {excelData.length > 0 && (
        <div className="my-4">
          <div className="overflow-x-auto max-h-64 border rounded">
            <table className="min-w-full text-xs">
              <thead>
                <tr>
                  {Object.keys(excelData[0]).map((key) => (
                    <th key={key} className="px-2 py-1 border-b">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.slice(0, 10).map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((v, j) => (
                      <td key={j} className="px-2 py-1 border-b">{String(v)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-muted-foreground mt-2">
              仅显示前 10 行预览
            </div>
          </div>
          <Button className="mt-4" onClick={handleImport} disabled={loading}>
            {loading ? "导入中..." : "确认导入"}
          </Button>
        </div>
      )}
      {result && <div className="mt-4 text-green-600">{result}</div>}
    </div>
  )
}
