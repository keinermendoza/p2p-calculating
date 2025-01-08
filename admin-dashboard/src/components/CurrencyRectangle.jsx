import AvatarCircle from "./ui/AvatarCircle"
export function CurrencyRectangle({image, amount, symbol}) {
    return (
      <div className={`w-full xs:w-fit p-3.5 rounded-lg flex justify-center items-center gap-2
                        dark:bg-gray-900 dark:text-gray-100     
                        bg-gray-100 text-gray-800`}>
        
        <AvatarCircle image={image}/>
        <span>{parseFloat(amount)}</span>
        <span>{symbol}</span>
      </div>
    )
  }

