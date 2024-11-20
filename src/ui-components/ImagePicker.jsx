import { useRef, useState } from 'react'
import { Icon } from './Icon'

export const ImagePicker = ({multiple = false, error, required, helperText, limit=4, onSelect, label, images=[], ...rest }) => {

    const imgRef = useRef(null)
    const [list, setList] = useState(images || [])    

    const handleInputChange = (e) => {
        if(e.target.files){
            if(multiple){
                let allFiles  = e.target.files                
                let allList = []
                for (var i = 0; i < allFiles.length; i++) {
                    let total_files = (list?.length || 0 ) + (i+1)
                    
                    if(allFiles[i]?.type.includes('image/') && total_files <= limit){
                        allList.push({
                            thumb: URL.createObjectURL(allFiles[i]),
                            file: allFiles[i]
                        })
                    }    
                }                
                setList([...list, ...allList ])
                onSelect([...list, ...allList ])
            }
            else{
                let file  = e.target.files[0]                
                if(file?.type.includes('image/')){
                    let img = URL.createObjectURL(file)
                    setList([{
                        thumb: img,
                        file: file,
                    }])
                    if(onSelect)
                        onSelect({thumb: img, file: file})
                }
                else{
                    alert("Only image files are allowed")
                }                
            }
            if(imgRef?.current){
                imgRef.current.value = null
            }

        }else{
            alert("Please select image file")
        }
    }

    const triggerSelect = () =>{
        var event = new MouseEvent('click', {
            'view': window, 
            'bubbles': true, 
            'cancelable': false
           });           
           imgRef.current.dispatchEvent(event);
    }

    const removeImage = (index) => {
        let allData = [...list]
        allData.splice(index, 1)        
        setList(allData)
        if(onSelect)
            onSelect(allData)
    }

    // console.log('List', list)
    return(
        <div>
            { label && (
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-white/50">{ label } {required && <span className="text-red-500">*</span>}</label>
            )}
            {
                helperText &&
                <div className="text-[13px] text-gray-400 dark:text-white/50">{ helperText }</div>
            }            
            { error && ( <p className="mt-1 text-sm text-red-600">{ error }</p> ) }
            <div className="flex flex-row flex-wrap items-stretch mx-[-10px]">
                {
                    (list?.length < limit) &&
                    <div className="w-1/4 p-[10px]">
                        <div onClick={triggerSelect} role="button" tabIndex={-1} onKeyDown={() => {}} className="bg-slate-100 cursor-pointer hover:bg-slate-200  appearance-none select-none flex items-center justify-center aspect-[4/3] rounded-lg overflow-hidden">
                            <div className="text-2xl text-slate-300">
                                <Icon name="folder-image-fill" />
                            </div>
                        </div>   
                    </div>
                }
                {
                    list?.map((item, i) =>
                        <div className="w-1/4 p-[10px] relative group" key={i}>                        
                            <img src={item?.thumb} className="aspect-[4/3] p-2 border object-contain rounded-lg" alt="" />
                            <button onClick={() => removeImage(i)} type="button" className="appearance-none absolute w-6 h-6 hidden items-center justify-center right-0 top-0  bg-red-600 rounded-full  group-hover:flex">
                                <Icon className="text-white" name="close-line" />
                            </button>                        
                        </div>
                    )
                }             
                <input multiple={multiple}  className="hiiden opacity-0 w-0 h-0 appearance-none" accept="image/*" max={limit} ref={imgRef} type="file" onChange={handleInputChange} {...rest} />   
            </div>            
        </div>
    )
}