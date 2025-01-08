import { primaryButtonStyle } from "../forms"
export function PrimaryButton({children, handleClick=null, isDisabled=false}) {
  return (
    <button
      disabled={isDisabled}
      onClick={handleClick}
      className={primaryButtonStyle}>{children}</button>
  )
}
