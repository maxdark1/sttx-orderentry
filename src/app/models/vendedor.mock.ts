import { faker } from '@faker-js/faker';

import { Vendedor } from './vendedor.model';

export const generateOneVendedor = () : Vendedor => {
    return {
        codigo: faker.datatype.uuid(),
        nombre: faker.commerce.productName()
    }
}

export const generateManyVendedores = (size = 10) : Vendedor[] => {
    const vendedores : Vendedor [] = new Array<Vendedor>(10);
    for(let i = 0; i < size; i++){
        vendedores.push(generateOneVendedor());
    }
    return [...vendedores];
}