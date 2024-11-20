import { useRef } from "react"
import { Pressable } from "./Pressable"

export const ImageSelector = ({onSelect, children}) => {

    const fileRef = useRef(null)

    const handleInputChange = (e) => {
        if(e.target.files){
            let file  = e.target.files[0]                
            if(file?.type.includes('image/')){
                let img = URL.createObjectURL(file)                
                if(onSelect)
                    onSelect({thumb: img, file: file})
            }
            else{
                alert("Only image files are allowed")
            }            
            if(fileRef?.current){
                fileRef.current.value = null
            }
            
        }
    }

    const triggerSelect = () => {
        var event = new MouseEvent('click', {
            'view': window, 
            'bubbles': true, 
            'cancelable': false
           });           
        fileRef.current.dispatchEvent(event);
    }

    return(
        <div className="">
            <Pressable onClick={triggerSelect}>
                {children}
            </Pressable>
            <input className="hiiden opacity-0 w-0 h-0 hidden appearance-none" accept="image/*" ref={fileRef} type="file" onChange={handleInputChange} />   
        </div>
    )
}