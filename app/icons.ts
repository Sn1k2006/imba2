// @ts-ignore
// import jimp from 'jimp';
// @ts-ignore

const jimp = require('jimp')
// @ts-ignore
const path = require('path')

const sizes = {
  'mipmap-hdpi': 72,
  'mipmap-mdpi': 48,
  'mipmap-ldpi': 60,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};
const sizesSplash = {
  'mipmap-hdpi': 1024,
  'mipmap-mdpi': 512,
  'mipmap-ldpi': 512,
  'mipmap-xhdpi': 1536,
  'mipmap-xxhdpi': 1536,
  'mipmap-xxxhdpi': 1536,
};
const sizesIos = [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024, 512];

const androidIconsPath = path.resolve(
  path.join('android', 'app', 'src', 'main', 'res'),
);
const iosIconsPath = path.resolve(path.join('ios', 'icons'));

const file = path.resolve(path.join('src', 'icon', '1536.png'));

jimp
  .read(file)
  .then(() => {
    // @ts-ignore
    Object.entries(sizes).forEach(async ([folder, size]: [string, number]) => {
      const image = await jimp.read(file);
      image.resize(size, size);
      image.write(`${androidIconsPath}/${folder}/ic_launcher.png`);
      image.circle();
      image.write(`${androidIconsPath}/${folder}/ic_launcher_round.png`);
    });
    // @ts-ignore
    Object.entries(sizesSplash).forEach(async ([folder, size]: [string, number]) => {
      const image = await jimp.read(file);
      image.resize(size, size);
      image.write(`${androidIconsPath}/${folder}/splash_icon.png`);
    });
    // @ts-ignore
    sizesIos.forEach(async (size: number) => {
      const image = await jimp.read(file);
      image.resize(size, size);
      image.write(`${iosIconsPath}/size_${size}.png`);
    });

    console.log('SUCCESS: ICONS GENERATED');
  })
  .catch(() => {
    console.log('ERROR: ENTRY FILE NOT FOUND');
  });
