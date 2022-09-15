
import axios from "axios";
import { stringify } from "querystring";
import fs from 'fs';


class Busquedas{

    historial=[]
    archivo = './db/data.json';

    constructor(){
        this.leerDB()
    }

    //param del api mapBox
    get paramsMapbox(){
        return{
            'access_token': process.env.mapbox_key, //El token esta almacenado en .env (variables de entorno)
            'limit': 5,
            'language': 'es'
        }
    }


    async ciudad(lugar =''){

        //Lo hacemos mediante un try, para 'catchear' algun posible error
        try {

            //peticion http            
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                //crearemos un metodo get() para recibir los parametros. Esto nos permitira reutilizarlos en otros momentos
                params: this.paramsMapbox
                
            })

            const resp = await instance.get();
            //retornaremos los datos en forma de un arreglo de objetos: [{}, {}, {}, {}, {}]
            return resp.data.features.map(lugar=>({
                id: lugar.id,
                nombre: lugar.place_name_es,
                latitud: lugar.center[1],
                longitud: lugar.center[0]

            }))

        } catch (error) {
            return [];
        }
    };


    async climaLugar(lat, lon){

        try {
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {
                    'appid': process.env.openweather_key,
                    'lat':lat,
                    'lon': lon,
                    'units': 'metric',
                    'lang': 'es'
                }
            });
            const resp = await instance.get();
            
            const {main, weather} = resp.data;
            return {
                temp: main.temp,
                min: main.temp_min,
                max: main.temp_max,
                desc: weather[0].description
            };
            
        } catch (error) {
            return error;
        }
    };
    
    
    // BASE DE DATOS ///////////////////////////////////////////////////////////////////////////////////////////////
    
    guardarDB (){
        const payload = {
            historial: this.historial
        }; 
        fs.writeFileSync(this.archivo, JSON.stringify(payload));         
    };
    
    leerDB(){
        if(!fs.existsSync(this.archivo)){
            return;
        }
        const info = fs.readFileSync(this.archivo, { encoding:'utf-8'})
        const data = JSON.parse(info)
        
        this.historial = data.historial;
                                 
        
    };
    
    agregarHistorial(lugar =''){
        if(this.historial.includes(lugar)){
            return;
        }
        //hacemos un slice(0,4) para mostrar solo las ultimas 5 busquedas en el historial
        this.historial = this.historial.slice(0,4)
        //cada nuevo lugar buscado se ubicara en la primera posicion [0]
        this.historial.unshift(lugar);
        //guardaremos el historial en el data.json
        this.guardarDB(this.historial)
    };
};

export{
    Busquedas
};
