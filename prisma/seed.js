const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {

    const demo = await prisma.user.upsert({
        where: { email: 'demo@mactoriums.cc' },
        update: {},
        create: {
            code: 'demo',
            displayName: 'Warayut Taekrathok',
            email: 'demo@mactoriums.cc',
            password: 'demo1234',
            phoneNumber: '0918136426',
            country: 'Thailand',
            address: '999/267 soi 3 Aurora',
            state: 'JorHo',
            city: 'Nakhon Ratchasima',
            zipCode: '30310',
            about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
            role: 'admin',
            isPublic: true,
        }
    })

    const department = await prisma.department.upsert({
        where: { code: 'ENG' },
        update: {},
        create: {
            code: 'ENG',
            name: 'Engineering',
        }
    })

    const TOOLLIST = [{
        "code": "35",
        "name": "Asset No."
    },
    {
        "code": "1",
        "name": "Barcode"
    },
    {
        "code": "2",
        "name": "Brand"
    },
    {
        "code": "19",
        "name": "Budget Type"
    },
    {
        "code": "37",
        "name": "Contract Date End"
    },
    {
        "code": "36",
        "name": "Contract Date Start"
    },
    {
        "code": "16",
        "name": "Contract No."
    },
    {
        "code": "17",
        "name": "Country"
    },
    {
        "code": "18",
        "name": "Date Purchase"
    },
    {
        "code": "31",
        "name": "Date Register"
    },
    {
        "code": "29",
        "name": "Date Update"
    },
    {
        "code": "9",
        "name": "department"
    },
    {
        "code": "23",
        "name": "Expected life (year)"
    },
    {
        "code": "46",
        "name": "External QR Code"
    },
    {
        "code": "4",
        "name": "Factory Serial"
    },
    {
        "code": "47",
        "name": "Image Tool"
    },
    {
        "code": "28",
        "name": "Last Update"
    },
    {
        "code": "8",
        "name": "location"
    },
    {
        "code": "15",
        "name": "Manual File"
    },
    {
        "code": "3",
        "name": "Model"
    },
    {
        "code": "6",
        "name": "Name"
    },
    {
        "code": "20",
        "name": "Price"
    },
    {
        "code": "5",
        "name": "QR Code"
    },
    {
        "code": "41",
        "name": "Ref. WI No."
    },
    {
        "code": "40",
        "name": "Reference for MPE"
    },
    {
        "code": "14",
        "name": "Remark"
    },
    {
        "code": "33",
        "name": "Responsible Person"
    },
    {
        "code": "22",
        "name": "Risk Level"
    },
    {
        "code": "7",
        "name": "Status"
    },
    {
        "code": "13",
        "name": "Supplier"
    },
    {
        "code": "21",
        "name": "Type of madical equipment"
    },
    {
        "code": "44",
        "name": "Using distance"
    },
    {
        "code": "45",
        "name": "Using time"
    },
    {
        "code": "24",
        "name": "Warranty (month)"
    },
    {
        "code": "30",
        "name": "Warranty Expire Date"
    }]
    let toollist = []
    for (const iterator of TOOLLIST) {

        const _toollist = await prisma.toollist.upsert({
            where: { code: iterator.code },
            update: {},
            create: {
                code: iterator.code,
                name: iterator.name,
            }
        })
        toollist.push(_toollist)
    }


    console.log({ demo, department, toollist })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })