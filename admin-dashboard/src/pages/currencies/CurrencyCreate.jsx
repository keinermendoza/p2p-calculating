import { NavLink, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { CardAction, CardFooter, PrimaryButton } from "../../components/ui";
import {ImageField, inputTextStyle} from "../../components/forms";
import { fetchPost } from "../../services/fetchPost";
import { useFetchGet } from '../../hooks/fetcher';
import Select from 'react-select';

import { ComeBackLink } from "../../components/ComeBackLink";
import { useMessageProvider } from "../../utils/MessageContext";

export  function CurrencyCreate() {
  const {data:currencyOptions} = useFetchGet("/api/currencies/available/")
  
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } = useForm();
  // const {addMessage} = useMessageProvider();

  
  const onSubmit = async (data) => {
    console.log("data", data);

  
    // const formData = new FormData();
    // Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    const response = await fetchPost("/api/currencies/", data);
    
    if (!response.errors) {
      // addMessage("Moneda creada con exito!");
      navigate("../");
    } else {
      console.log(response.errors) 

    }
  }
const darkStyles = "dark:bg-gray-700 dark:border-gray-600  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  return (
    <section>
      <ComeBackLink />

      <h1 className="text-3xl font-medium">Registrar Moneda</h1>

      <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)} >
      <CardAction extraClass="gap-4">
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium  text-gray-900 dark:text-white">Nombre</label>
          {errors.name && <p className="text-red-800 font-medium">{errors.name.message}</p>}
          <input 
          placeholder="Real" 
          className={inputTextStyle}
          {...register("name", 
            {
              required: {value: "Proporciona un nombre"},
              maxLength: {value:100, message: "el nombre no puede tener más de 100 letras"},
            }
          )}
          />
        </div>

          <div>

          <label htmlFor="code" className="block mb-2 text-sm font-medium  text-gray-900 dark:text-white">Codigo</label>
          {errors.name && <p className="text-red-800 font-medium">{errors.name.message}</p>}

            <Controller
                name="code"
                control={control}
                defaultValue={null} // Valor inicial
                render={({ field }) => (
                    <Select
                        {...field}
                        options={currencyOptions?.map(item => ({
                          value: item,
                          label: item,
                        }))}
                        value={currencyOptions?.find(c => c.value === field.value)}
                        onChange={val => field.onChange(val.value)}

                        
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

     
        {/* https://claritydev.net/blog/react-hook-form-multipart-form-data-file-uploads */}
        {/* https://react-hook-form.com/docs/usecontroller/controller */}

          {/* <Controller
            control={control}
            name={"image"}
            // rules={{ required: "Recipe picture is required" }}
            render={({ field: { value, onChange, ...field } }) => { // this line makes the magic
              return (
                <ImageField
                  {...field}
                  value={value?.fileName}
                  onChange={(event) => {
                    onChange(event.target.files[0]);
                  }
                }
                />
              );
            }}
          />

        */}

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