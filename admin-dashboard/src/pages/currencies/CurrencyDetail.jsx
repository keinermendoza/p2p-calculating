import { useEffect } from "react";
import { useParams, NavLink, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { useFetchGet} from '../../hooks/fetcher';
import { fetchPost, getCookie } from "../../services/fetchPost";
import { CardAction, CardFooter, PrimaryButton, SimpleCard } from "../../components/ui";
import {ImageField, inputTextStyle, darkStyles} from "../../components/forms";
import {ModalDelete} from "../../components/ModalDelete";
import { toast } from 'react-toastify';
import { ComeBackLink } from "../../components/ComeBackLink";
import Select from 'react-select';


export  function CurrencyDetail() {
  let { id } = useParams();
  const navigate = useNavigate();
  const endpoint = "/api/currency/" + id + "/";
  

  const {data:currency, loading, error} = useFetchGet(endpoint);
  const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } = useForm();
  
  const onSubmit = async (data) => {
    console.log(data)
    const response = await fetchPost(endpoint, {filters: data}, "PATCH");

    if (!response.errors) {
      toast.success("Filtros actualizados con exito!");
      navigate("../");
    } else {
      toast.error("No fue posible actualizar los filtros");

    }

  }

  const deleteCurrency = async () => {
    try {
      const resp = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": getCookie("csrftoken"),
        },
        method: "DELETE"
      });

      if (!resp.ok) {
        if (resp.status == "500") {
          throw new Error("Problema en el servidor");
        }
      }

      toast.success("Moneda eliminada con exito!");
      navigate("../");
    } catch(err) {
      toast.error(err.message || "No fue posible eliminar la moneda");
    }
  }


  // update fields when data is loaded  
  useEffect(() => {
    if (currency) {
      setValue( "payTypes", currency?.currency?.filters?.payTypes);
      setValue( "transAmount", currency?.currency?.filters?.transAmount);
    }
  }, [currency]);


  if (loading) {
      return <div>Cargando...</div>;
  }
  if (error) {
      return <div>Error: {error}</div>;
  }

  return (
    <section>
      <ComeBackLink />
      <SimpleCard>


      <h1 className="mb-2 text-2xl font-medium whitespace-pre">Editando Filtros de  <span className="text-4xl text-blue-600 dark:text-indigo-600 ">{currency?.currency.name}</span></h1>
      <p className="text-lg mb-4 ">Código <span className="font-semibold text-2xl text-blue-600 dark:text-indigo-600">{currency?.currency.code}</span></p>


      <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)} >

      <div className="mb-4">
        <label htmlFor="payTypes" className="block mb-2 text-sm font-medium  text-gray-900 dark:text-white">Metodos de Pago</label>
        {errors.payTypes && <p className="text-red-800 font-medium">{errors.payTypes.message}</p>}

          <Controller
              name="payTypes"
              control={control}
              defaultValue={null} // Valor inicial
              render={({ field }) => (
                  <Select
                      {...field}
                      options={currency?.tradeMethods.map(item => ({
                        value: item,
                        label: item,
                      }))}

                      defaultValue={currency?.currency?.filters?.payTypes?.map(item => ({
                        value: item,
                        label: item,
                      }))}

                      value={currency?.tradeMethods.find(c => c.value === field.value)}
                      onChange={val => field.onChange(val.map(c => c.value))}
                      isMulti

                      
                      classNames={{
                        control: (state) => "p-0.5 rounded-md placeholder:text-gray-100  " + darkStyles,
                        input: (state) => "text-white  dark:text-white placeholder:text-red-400",
                        option: (state) => state.isSelected ? "bg-blue-400 dark:bg-indigo-600" : "hover:bg-slate-400 dark:hover:bg-slate-800",
                        menuList: (state) => "dark:text-white " + darkStyles,
                      }}

                      // overriding styles, because styles takes precedence over classNames
                      styles={{
                        input: (base) => ({
                          ...base,
                          "input:focus": {
                            boxShadow: "none",
                          },
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: '',
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: '',
                        })
              

                      }}
                    
                      placeholder="Selecciona una opción"
                  />
              )}
          />
      </div>

      <div>
          <label htmlFor="transAmount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Valor de Operación</label>
          {errors.transAmount && <p className="text-red-800 font-medium">{errors.transAmount.message}</p>}
            
            <input 
            type="number"
            className="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register("transAmount", 
              {
                valueAsNumber: true,
                min: {value: 0, message: "el valor debe ser postivo"},
                max: {value: 999999999999, message: "el valor es demasiado alto"},
              }
            )}
            />
      </div>

          

       


        <CardFooter extraClass="justify-end">
          <PrimaryButton
            isDisabled={isSubmitting}
          
          >Guardar Cambios</PrimaryButton>
        </CardFooter>

      </form>
      </SimpleCard>

      <div className="mt-12 w-full max-w-4xl flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="w-full max-w-lg">
          <p className="text-lg mb-2">Eliminar Moneda</p>
          <p className="text-sm">Al eliminar ésta moneda dejarás de verla en los calculos e intercambios</p>
        </div>

        <ModalDelete 
            isDisabled={isSubmitting}

        deleteButtonText="Eliminar Moneda"
        deleteCallback={deleteCurrency}>
          <h3 className="mb-2 text-lg text-gray-500 dark:text-gray-400">Estás seguro de que quieres eliminar esta Moneda?</h3>
        </ModalDelete>
      </div>

    </section>
  )
}


        {/* https://claritydev.net/blog/react-hook-form-multipart-form-data-file-uploads */}
        {/* https://react-hook-form.com/docs/usecontroller/controller */}