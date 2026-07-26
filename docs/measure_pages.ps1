# Measures heading page numbers and detects blank pages using Word COM.
# Output: headings.txt (TAB-separated: adjustedPage <TAB> headingText)
#         console report of any blank pages
$ErrorActionPreference = "Stop"
$docPath = Join-Path $PSScriptRoot "CSMMS_MCA_Project_Report.docx"
$outPath = Join-Path $PSScriptRoot "headings.txt"

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $doc = $word.Documents.Open($docPath, $false, $true)
    $doc.Repaginate()

    # 1) heading -> page map
    $results = New-Object System.Collections.Generic.List[string]
    foreach ($p in $doc.Paragraphs) {
        $t = $p.Range.Text.Trim()
        if ($t -match '^(CHAPTER \d+$|ACKNOWLEDGEMENT$|SYNOPSIS$|BIBLIOGRAPHY|\d+\.\d+(\.\d+)?\s+\S)') {
            $pg = $p.Range.Information(1)  # wdActiveEndAdjustedPageNumber
            $results.Add("$pg`t$t")
        }
    }
    $results | Set-Content -Path $outPath -Encoding UTF8
    Write-Output "Wrote $($results.Count) headings to headings.txt"

    # 2) blank page detection (absolute page numbers)
    $pages = $doc.ComputeStatistics(2)  # wdStatisticPages
    Write-Output "Total pages: $pages"
    $blanks = 0
    for ($i = 1; $i -le $pages; $i++) {
        $word.Selection.GoTo(1, 1, $i) | Out-Null   # wdGoToPage, absolute
        $r = $doc.Bookmarks.Item("\Page").Range
        $txt = ($r.Text -replace '[\s\a\f]', '')
        if ($txt.Length -eq 0 -and $r.InlineShapes.Count -eq 0) {
            Write-Output "BLANK PAGE at absolute page $i"
            $blanks++
        }
    }
    if ($blanks -eq 0) { Write-Output "No blank pages found." }
    $doc.Close($false)
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
