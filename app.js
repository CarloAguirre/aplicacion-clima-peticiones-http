
//El package 'dotenv' nos permite guardar el mapbox_key y otros token en las variables de entorno
import * as dotenv from 'dotenv';
dotenv.config();
import { inquirerMenu, leerInput, pausa, listarLugares } from "./helpers/inquirer.js"
import { Busquedas } from "./models/busquedas.js";

const main = async()=>{

    const busquedas = new Busquedas();
    let opcion;

    do {

        opcion = await inquirerMenu();
        switch (opcion) {
            case 1:
                //mostrar mensaje
                const lugar = await leerInput('Ciudad: ');
                
                //buscar los lugares
                const lugares = await busquedas.ciudad(lugar);
                
                //seleccionar lugar
                const id = await listarLugares(lugares) // --> Retorna el {id} del lugar seleccionado                              
                if(id !== '0'){
                    const lugarSelec = lugares.find(l => l.id ===id);
                    console.log(`\ncargando datos...`.yellow);                                   
                    
                    //agregar al historial / guardar DB
                    busquedas.agregarHistorial(lugarSelec.nombre);
                    
                    //clima
                    const clima = await busquedas.climaLugar(lugarSelec.latitud, lugarSelec.longitud);
                    
                    //mostrar resultados
                    console.clear();
                    console.log('\n Información de la ciudad\n'.green);
                    console.log('Ciudad:', lugarSelec.nombre );   
                    console.log('Latitud:', lugarSelec.latitud ); 
                    console.log('Longitud:', lugarSelec.longitud ); 
                    console.log('Temperatura:', clima.temp ); 
                    console.log('Mínima:', clima.min ); 
                    console.log('Máxima:', clima.max );
                    console.log('Descripción:', clima.desc );            
                    break;
                }
                
                case 2:
                    busquedas.historial.forEach((lugar, index)=>{
                           const idx = `${index + 1 + '.'}`.green;
                           console.log(`${idx} ${lugar}`);
                        })   
                
                break;
        
            default:
                break;
        }
        busquedas.guardarDB()
        await pausa();
        
    } while (opcion !== 0)


};

main();