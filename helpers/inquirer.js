
import colors from 'colors';
import inquirer from 'inquirer';
import { validate } from 'uuid';


const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: 'Que te gustaria hacer?',
        choices: [ 
            // estas son las preguntas que inquirer enviara al prompt([])                                      
            {
                value: 1,
                name: `${'1.'.green} Buscar Ciudad`
            },

            {
                value: 2,
                name: `${'2.'.green} Ver Historial`
            },

            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
        ]            
    }
]



const inquirerMenu = async()=>{

    console.clear();

    console.log('================================='.green)
    console.log('      Seleccione una opción')
    console.log('=================================\n'.green)

    // inquirer espera que le enviemos las preguntas como un []
    const {opcion} = await inquirer.prompt(preguntas)   
    return opcion;
}


const pausa = async()=>{
    
    const question = [
        {
            type:'input',
            name: 'enter',
            message: `\nPresione ${'ENTER'.blue} para continuar\n`,
        }
    ]

    await inquirer.prompt(question)
    
}


const leerInput = async(message)=>{
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value){
                if(value.length ===0){
                    return 'Por favor ingrese un valor valido.'
                }
                //Debemos retornar true o si no no se completara la funcion
                return true;          
            }
        }
    ];

    const {desc} = await inquirer.prompt(question);
    return desc;
}



const listarLugares = async(lugares = [])=>{

    //Creamos las choises a partir de el index y desc de las tareas con el metodo map()
    const choices = lugares.map((lugar, index)=>{
        const idx = `${index + 1}.`.green;
    
        //retornamos el 'value' (uuid de la tarea) y 'name' que imprimira el prompt()
        return{
            value: lugar.id,
            name: `${idx.green}` + ' ' + lugar.nombre,
            
        }
    })
    
    // agregamos una opcion para caancelar y salir del menu sin borrar ninguna tarea
    choices.unshift({
        value: '0',
        name: '0. '.green + 'Cancelar'
    })

    //Creamos el prompt con las choices desprendidas del metodo map()
    const question = [
        {
            type: 'list',
            name: 'id',
            message:'Seleccionar lugar: ',
            choices
        }
    ]

    const {id} = await inquirer.prompt(question)

    return id;
    
};   



export {
 inquirerMenu,
 pausa,
 leerInput,
 listarLugares
};