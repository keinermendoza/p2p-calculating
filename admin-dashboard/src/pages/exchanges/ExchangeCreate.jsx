import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import { CardAction, CardFooter, PrimaryButton } from "../../components/ui";
import { ExchangeCurrencyDropdown } from "../../components/forms";
import { useFetchGet} from '../../hooks/fetcher';
import { fetchPost } from "../../services/fetchPost";
import { ComeBackLink } from "../../components/ComeBackLink";
import { useMessageProvider } from "../../utils/MessageContext";


export  function ExchangeCreate() {
  const [baseCurrency, setBaseCurrency] = useState(null); // object
  const [targetCurrency, setTargetCurrency] = useState(null); // object
  const navigate = useNavigate();
  const {addMessage} = useMessageProvider();
  
  const {data:currencyOptions} = useFetchGet("currencies");
  const { register, handleSubmit, setValue, setError, clearErrors, control, formState: { errors, isSubmitting } } = useForm();
  
  const onSubmit = async (data) => {
    const response = await fetchPost("exchangerates", data);

    if (response.errors) {
      const dataKeys = Object.keys(data);
      showErrors(dataKeys, response.errors)
    } else {
    
        if (response.message) {
          toast.success(response.message);
    
        }
        addMessage("Tipo de Cambio creado con exito!");
        navigate("../");

    }
  }

  function showErrors(keys, errorObj) {
    Object.keys(errorObj).forEach(key => {
      if(keys.includes(key)) {
        console.log(key, errorObj[key])
        setError(key, { type: "server", message: errorObj[key] })
      } else {
        toast.error(errorObj[key]);
      }
    });
  }

  const getCurrencyById = (selectedId) => {
    const resultList = currencyOptions.filter((currency) => currency.id == selectedId)
    return resultList[0];
  }

  const handleSelectBaseCurrency = (id) => {
    setBaseCurrency(getCurrencyById(id));
  }
  
  const handleSelectTargetCurrency = (id) => {
    setTargetCurrency(getCurrencyById(id));
  }

  useEffect(() => {
    if(baseCurrency) {
      setValue("base_currency", baseCurrency.id)
      clearErrors("base_currency")
    }
  },[baseCurrency])

  useEffect(() => {
    if(targetCurrency) {
      setValue("target_currency", targetCurrency.id)
      clearErrors("target_currency")
    }
  },[targetCurrency])

  
  return (
    <section>

      <ToastContainer />
      <ComeBackLink />

      <h1 className="text-3xl font-medium">Registrar Tipo de Cambio</h1>

      <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)} >
      <CardAction extraClass="gap-4">
        <div>
          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Moneda Base</p>
          {errors.base_currency && <p className="text-red-800 font-medium">{errors.base_currency.message}</p>}
          <ExchangeCurrencyDropdown
            options={currencyOptions}
            selectedOption={baseCurrency}
            handleChange={handleSelectBaseCurrency}
          />
        </div>

        <div>
          <label htmlFor="base_amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Valor de Moneda Base</label>
          {errors.base_amount && <p className="text-red-800 font-medium">{errors.base_amount.message}</p>}
          <div className="flex">
            <span className="w-10 grid place-content-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              {baseCurrency && baseCurrency.symbol}
            </span>
            <input 
            type="number"
            min={0.000001}
            step={0.000001}
            className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register("base_amount", 
              {
                min: {value: 0.000001, message: "el valor debe ser postivo"},
                max: {value: 999999999999, message: "el valor es demasiado alto"},
                required: "Proporciona un monto para la moneda base",
              }
            )}
            />
          </div>
          
        </div>

        <div>
          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Moneda de Destino</p>
          {errors.target_currency && <p className="text-red-800 font-medium">{errors.target_currency.message}</p>}
          <ExchangeCurrencyDropdown
            options={currencyOptions}
            selectedOption={targetCurrency}
            handleChange={handleSelectTargetCurrency}
          />
        </div>

        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Valor Moneda de Destino</label>
          {errors.target_amount && <p className="text-red-800 font-medium">{errors.target_amount.message}</p>}
          <div className="flex">
            <span className="w-10 grid place-content-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              {targetCurrency && targetCurrency.symbol}
            </span>
            <input 
            type="number"
            min={0.000001}
            step={0.000001}
            className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register("target_amount", 
              {
                min: {value: 0.000001, message: "el valor debe ser postivo"},
                max: {value: 999999999999, message: "el valor es demasiado alto"},
                required: "Proporciona un monto para la moneda de destino",
              }
            )}
            />
          </div>
        </div>


        <input 
          type="hidden"
          {...register("base_currency", 
            {
              required: "Selecciona una moneda base",
            }
          )}
        />

        <input 
          type="hidden"
          {...register("target_currency", 
            {
              required: "Selecciona una moneda de destino",
            }
          )}
        />
        
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
