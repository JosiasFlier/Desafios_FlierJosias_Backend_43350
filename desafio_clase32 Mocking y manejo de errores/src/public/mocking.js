import { fakerES_MX as faker } from '@faker-js/faker'


// Genero libros falsos
export const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.music.songName(),
        description: faker.lorem.paragraph(2),
        code: faker.string.alpha(10),
        status: true,
        price: parseFloat(faker.commerce.price({ min: 10000, max: 20000, dec: 0 })),
        stock: parseInt(faker.number.int({ min: 10, max: 30 })),
        category: faker.music.genre(),
        thumbnail: [faker.image.url()],
    };
};