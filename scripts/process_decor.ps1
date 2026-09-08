Add-Type -AssemblyName System.Drawing

$origPath = "C:\Users\LENOVO\.gemini\antigravity-ide\brain\69c3f96e-6b26-40d9-a508-0b00fed23383\.user_uploaded\media_1788879254353.png"
$orig = [System.Drawing.Bitmap]::FromFile($origPath)

# Copy original PNG directly (no recompression, 100% original pixel data)
Copy-Item $origPath "public\images\celebrations\party-decor-bg.png" -Force

# Save high quality JPG
$orig.Save("public\images\celebrations\party-decor-bg.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)

# Extract Left decor (x: 0, y: 0, w: 460, h: 382)
$leftBmp = New-Object System.Drawing.Bitmap 460, 382
$gLeft = [System.Drawing.Graphics]::FromImage($leftBmp)
$srcRectLeft = New-Object System.Drawing.Rectangle 0, 0, 460, 382
$destRectLeft = New-Object System.Drawing.Rectangle 0, 0, 460, 382
$gLeft.DrawImage($orig, $destRectLeft, $srcRectLeft, [System.Drawing.GraphicsUnit]::Pixel)
$gLeft.Dispose()
$leftBmp.Save("public\images\celebrations\party-decor-left.png", [System.Drawing.Imaging.ImageFormat]::Png)
$leftBmp.Dispose()

# Extract Right decor (x: 564, y: 0, w: 460, h: 382)
$rightBmp = New-Object System.Drawing.Bitmap 460, 382
$gRight = [System.Drawing.Graphics]::FromImage($rightBmp)
$srcRectRight = New-Object System.Drawing.Rectangle 564, 0, 460, 382
$destRectRight = New-Object System.Drawing.Rectangle 0, 0, 460, 382
$gRight.DrawImage($orig, $destRectRight, $srcRectRight, [System.Drawing.GraphicsUnit]::Pixel)
$gRight.Dispose()
$rightBmp.Save("public\images\celebrations\party-decor-right.png", [System.Drawing.Imaging.ImageFormat]::Png)
$rightBmp.Dispose()

# Also create a wide 1920x450 seamless banner:
$wideBmp = New-Object System.Drawing.Bitmap 1920, 450
$gWide = [System.Drawing.Graphics]::FromImage($wideBmp)
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$gWide.FillRectangle($brush, 0, 0, 1920, 450)
$brush.Dispose()
# Draw left decor on the left
$destLeftWide = New-Object System.Drawing.Rectangle 0, 34, 460, 382
$gWide.DrawImage($orig, $destLeftWide, $srcRectLeft, [System.Drawing.GraphicsUnit]::Pixel)
# Draw right decor on the right
$destRightWide = New-Object System.Drawing.Rectangle (1920 - 460), 34, 460, 382
$gWide.DrawImage($orig, $destRightWide, $srcRectRight, [System.Drawing.GraphicsUnit]::Pixel)
$gWide.Dispose()
$wideBmp.Save("public\images\celebrations\party-decor-wide.png", [System.Drawing.Imaging.ImageFormat]::Png)
$wideBmp.Dispose()

$orig.Dispose()
Write-Output "ALL_DONE"
