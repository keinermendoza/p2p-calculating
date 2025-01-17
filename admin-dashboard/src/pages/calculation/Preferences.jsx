import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { CardAction, CardFooter, PrimaryButton } from "../../components/ui";
import { inputTextStyle, darkStyles} from "../../components/forms";
import { fetchPost } from "../../services/fetchPost";
import { useFetchGet } from '../../hooks/fetcher';
import Select from 'react-select';

import { ComeBackLink } from "../../components/ComeBackLink";

import {toast} from "react-toastify";

export  function Preferences() {
  const {data:preferences} = useFetchGet("/api/selection-calculation-preferences/")
  
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } = useForm();


  useEffect(() => {
    if (preferences) {
      setValue( "profitMargin", parseFloat(preferences.profitMargin * 100));
      setValue( "referencePricePosition", preferences.referencePricePosition);
    }
  }, [preferences]);

  const onSubmit = async (data) => {
    console.log("submiting...")
    console.log(data)

    console.log("reding preference...")

    const method = preferences ? "PUT" : "POST"
    const endpoint =  preferences ?
        `/api/selection-calculation-preferences/${preferences?.id}/` 
        : "/api/selection-calculation-preferences/"


        const responseData = await fetchPost(endpoint, data, method);
    if (!responseData.errors) {
      toast.success("Preferencias actualizadas con exito!");
    } else {
      toast.error("No fue guardar los cambios");
    }
  }

  return (
    <section>
      <ComeBackLink />

        <div className="mb-4 max-w-xl">
            <h1 className="mb-2 text-3xl font-medium">Preferencias</h1>
            <p className="text-sm"> Los siguientes valores serán usados a la hora de seleccionar los precios de referencia y calcular las tasas de cambio que se darán a los clientes.</p>
        </div>

      <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)} >
      <CardAction extraClass="gap-4">
        <div>
            <label htmlFor="profitMargin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Margen de Ganancia</label>
            {errors.profitMargin && <p className="text-red-800 font-medium">{errors.profitMargin.message}</p>}
                
                <input 
                type="number"
                className="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                {...register("profitMargin", 
                {
                    valueAsNumber: true,
                    min: {value: 1, message: "el valor minimo es 1"},
                    max: {value: 8, message: "el valor maximo es 9999"},
                }
                )}
                />
        </div>

        <div>
            <label htmlFor="referencePricePosition" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Posición de Referencia</label>
            <p className="text-sm mb-2 text-opacity-25">Escoge la posición de  la lista de ofertas en binance que usarás como referencia</p>
            {errors.referencePricePosition && <p className="text-red-800 font-medium">{errors.referencePricePosition.message}</p>}
                
                <input 
                type="number"
                className="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                {...register("referencePricePosition", 
                {
                    valueAsNumber: true,
                    min: {value: 1, message: "el valor minimo es 1"},
                    max: {value: 8, message: "el valor maximo es 8"},
                }
                )}
                />
        </div>

        <CardFooter extraClass="justify-end">
          <PrimaryButton
            isDisabled={isSubmitting}
          
          >Guardar Cambios</PrimaryButton>
        </CardFooter>
      </CardAction>  


      </form>

    </section>
  )
}

// https://stackoverflow.com/questions/62795886/returning-correct-value-using-react-select-and-react-hook-form
// for multi 
// value={options.filter(c => value.includes(c.value))}
//       onChange={val => onChange(val.map(c => c.value))}