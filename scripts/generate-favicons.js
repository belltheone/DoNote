// 파비콘 생성 스크립트
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../public/logo-140.png');
const publicDir = path.join(__dirname, '../public');

async function generateFavicons() {
    console.log('파비콘 생성 시작...');

    try {
        // favicon-16x16.png
        await sharp(inputPath)
            .resize(16, 16)
            .png()
            .toFile(path.join(publicDir, 'favicon-16x16.png'));
        console.log('✓ favicon-16x16.png 생성');

        // favicon-32x32.png
        await sharp(inputPath)
            .resize(32, 32)
            .png()
            .toFile(path.join(publicDir, 'favicon-32x32.png'));
        console.log('✓ favicon-32x32.png 생성');

        // apple-touch-icon.png (180x180)
        await sharp(inputPath)
            .resize(180, 180)
            .png()
            .toFile(path.join(publicDir, 'apple-touch-icon.png'));
        console.log('✓ apple-touch-icon.png 생성');

        // icon-192.png (PWA)
        await sharp(inputPath)
            .resize(192, 192)
            .png()
            .toFile(path.join(publicDir, 'icon-192.png'));
        console.log('✓ icon-192.png 생성');

        // icon-512.png (PWA)
        await sharp(inputPath)
            .resize(512, 512)
            .png()
            .toFile(path.join(publicDir, 'icon-512.png'));
        console.log('✓ icon-512.png 생성');

        // favicon.ico (32x32 PNG를 ICO로 저장 - sharp로는 직접 ICO 생성 불가, PNG로 대체)
        await sharp(inputPath)
            .resize(32, 32)
            .png()
            .toFile(path.join(publicDir, 'favicon.png'));
        console.log('✓ favicon.png 생성');

        console.log('\n모든 파비콘 생성 완료!');
    } catch (error) {
        console.error('에러:', error);
    }
}

generateFavicons();
