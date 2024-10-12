
import { faker } from '@faker-js/faker';
import axios from 'axios';


// const [generatedData, setGeneratedData] = useState([]);

const FillItemWithData = (itemWithoutData, type) => {
    const itemWithData = {}

    const itemkey = Object.keys(itemWithoutData)
    const typeKey = Object.keys(type)

    itemkey?.map(fieldItem => {
        typeKey?.map(fieldType => {
            if (fieldItem === fieldType) {
                switch (type[fieldType]) {
                    case 'int':
                        itemWithData[fieldItem] = faker.number.int({ min: 1, max: 3 })
                        break;
                    case 'nvarchar':
                        itemWithData[fieldItem] = faker.string.alpha(6)
                        break;
                    default:
                        itemWithData[fieldItem] = null
                        break
                }
            }
        })
    })
    return itemWithData
}


const generateData = (count) => {
    const data = {
        "customData": []
    }
    for (let i = 0; i < count; i++) {
        const person = {
            // id: faker.string.uuid(),
            firstname: faker.person.firstName('female'),
            lastname: faker.person.lastName(),
            age: 3,
            tell: faker.phone.number(),
            city: faker.location.city(),
            FK_city: 2,
            expand: true,
            subGroup: [
                {
                    id: faker.string.uuid(),
                    name1: faker.person.firstName(),
                    text1: faker.lorem.words(5),
                    expand: true,
                    subGroup: [
                        {
                            id: faker.string.uuid(),
                            test_1: faker.person.firstName(),
                            test_2: faker.lorem.words(5),
                            expand: false

                        }
                    ]
                },
                {
                    id: faker.string.uuid(),
                    name1: faker.person.firstName(),
                    text1: faker.lorem.words(5),

                    expand: true,
                    subGroup: [
                        {
                            id: faker.string.uuid(),
                            test_1: faker.person.firstName(),
                            test_2: faker.lorem.words(5),
                            expand: false
                        }
                    ]
                }
            ]

        }
        data.customData.push(person);
    }
    if (count === 1/*insert*/) {
        const person = {
            // id: faker.string.uuid(),
            firstname: faker.person.firstName('female'),
            lastname: faker.person.lastName(),
            age: 3,
            tell: faker.phone.number(),
            city: 1,//faker.location.city(),
            //  FK_city:3,
            //  expand: false
        }
        data.customData.push(person);
        return (person) //JSON.stringify(dataRaw)
    }
    else {
        saveData(data);
    }
}

const saveData = (data) => {

    // axios.post('http://localhost:3001/api/save-data', {
    //     title: 'New Post'
    // })

    axios.post('http://localhost:3002/api/save-data', data)
        .then(response => {
        })
        .catch(error => {
            console.error('Error saving data:', error);
        });
};
// if (count === 1) {
//     return generateData
// }
// else {
//     return (
//         <div>
//             <button onClick={generateData}>Generate Data For DataGrid</button>
//             <button onClick={saveData}>Save Data</button>
//             <pre>{JSON.stringify(generatedData, null, 2)}</pre>
//         </div>
//     );
// }
//};

export default { saveData, FillItemWithData }
