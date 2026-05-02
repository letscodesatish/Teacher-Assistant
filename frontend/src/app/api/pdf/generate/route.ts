import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { noticeRef, issueDate, exams } = body;

        // Path to the HTML template
        const templatePath = path.join(process.cwd(), 'src', 'templates', 'OfficialNotice.html');
        const templateHtml = fs.readFileSync(templatePath, 'utf8');

        // Compile template with data
        const template = handlebars.compile(templateHtml);
        const html = template({ noticeRef, issueDate, exams });

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        
        // Set content and wait for network to be idle (important for Tailwind CDN)
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                bottom: '20mm',
                left: '20mm',
                right: '20mm',
            },
        });

        // Create public/notices directory if it doesn't exist
        const noticesDir = path.join(process.cwd(), 'public', 'notices');
        if (!fs.existsSync(noticesDir)) {
            fs.mkdirSync(noticesDir, { recursive: true });
        }

        const fileName = `notice_${noticeRef.replace(/\//g, '_')}_${Date.now()}.pdf`;
        const filePath = path.join(noticesDir, fileName);
        
        fs.writeFileSync(filePath, pdfBuffer);

        await browser.close();

        // Return the public URL and the Base64 encoded string
        const publicUrl = `/notices/${fileName}`;
        const base64Pdf = pdfBuffer.toString('base64');
        return NextResponse.json({ 
            success: true, 
            url: publicUrl,
            fullUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${publicUrl}`,
            base64: base64Pdf
        });

    } catch (error: any) {
        console.error('PDF Generation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
