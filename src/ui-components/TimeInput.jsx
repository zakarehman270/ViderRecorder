import { useState, useEffect  } from "react"
import dayjs from "dayjs"

export const TimeInput = ({label, error, required, ...rest}) => {
    
    const [ hours, setHours ] = useState( '00' )
    const [ minutes, setMinutes ] = useState( '00' )
    const [ ap, setAp ] = useState( 'AM' )
    const [ value, setValue ] = useState('0000')
    
    const formatTime = ( val ) => String( val ).padStart( 2, '0' );

    const errorStyles = error ? "border-red-500 focus:ring-red-500" : "";
    
    const handleHoursChange = ( e ) => {
        const value = e.target.value;
        if ( value.length <= 2 && /^[0-9]*$/.test( value ) ) {
            const parsedValue = Number( value );            
            if ( parsedValue <= 12 ) {
                setHours( value );
            }
        }
    };

    const handleHoursBlur = () => {
        const formattedHours = formatTime( hours );
        setHours( formattedHours );        
        // const hoursValue = parseInt( formattedHours );        
        
    };

    // Handle minutes input changes
    const handleMinutesChange = ( e ) => {
        const value = e.target.value;
        if ( value.length <= 2 && /^[0-9]*$/.test( value ) ) {
            const parsedValue = Number( value );
            if ( parsedValue < 60 ) {
                setMinutes( value );
            }
        }
    };

    const handleMinutesBlur = () => {
        const formattedMinutes = formatTime( minutes );
        setMinutes( formattedMinutes );                
    };
    
    const adjustHours = () => {        
        // let updatedDate = dayjs()        
        // let currentHours = parseInt(hours, 10)
        // let currentMinutes = parseInt(minutes, 10)            

        // if(ap === 'AM'){
        //     updatedDate = updatedDate.set('hour', currentHours + 12 );
        // }else{
        //     updatedDate = updatedDate.set('hour', currentHours);
        // }

        // updatedDate = updatedDate.set('minute', currentMinutes);
        // console.log(dayjs(updatedDate).format('HH:mm'))
        setAp(ap === 'AM' ? 'PM' : 'AM')
        
    }

    const handleHoursKeyDown = ( e ) => {

        if ( e.key === 'ArrowUp' ) {
            let newHours = Number( hours ) + 1;
            if ( newHours > 12 ) newHours = 1;
            setHours( formatTime( newHours ) );
        } else if ( e.key === 'ArrowDown' ) {
            let newHours = Number( hours ) - 1;
            if ( newHours < 1 ) newHours = 12;
            setHours( formatTime( newHours ) );
        }
    };

    const handleMinutesKeyDown = ( e ) => {
        if ( e.key === 'ArrowUp' ) {
            let newMinutes = Number( minutes ) + 1;
            if ( newMinutes >= 60 ) newMinutes = 0;
            setMinutes( formatTime( newMinutes ) )
        } else if ( e.key === 'ArrowDown' ) {
            let newMinutes = Number( minutes ) - 1;
            if ( newMinutes < 0 ) newMinutes = 59;
            setMinutes( formatTime( newMinutes ) )
        }
    }

    useEffect(() => {        
        let updatedDate = dayjs()        
        let currentHours = parseInt(hours || 0, 10)
        let currentMinutes = parseInt(minutes, 10)   
        
        if(ap === 'PM'){
            updatedDate = updatedDate.set('hour', currentHours + 12 ).set('minute', minutes);
        }else{
            updatedDate = updatedDate.set('hour', currentHours);
        }

        updatedDate = updatedDate.set('minute', currentMinutes);
        const val = dayjs(updatedDate).format('HHmm');                
        setValue(val)

    }, [hours, minutes, ap])

    return (
        <div className="flex flex-col w-full">
            { label && (
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-white/50">{ label } {required && <span className="text-red-500">*</span>}</label>
            ) }
            <div className="relative flex items-center">
                <div className="flex flex-1 h-full flex-row items-center justify-stretch gap-x-1">
                    <div className="flex-1 h-full">
                        <input
                            value={ hours }
                            onChange={ handleHoursChange }
                            onBlur={ handleHoursBlur }
                            onKeyDown={ handleHoursKeyDown }
                            className={`appearance-none h-10 text-center w-full text-sm leading-tight  transition-all duration-300 ease-in-out 
                                rounded-md focus:ring-1 focus:ring-offset-0
                                border bg-transparent dark:bg-slate-700 text-slate-600 dark:text-slate-300  border-gray-300 dark:border-slate-600 outline-0 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-300 dark:focus:ring-primary-300
                                ${ errorStyles }
                                `}
                        />
                    </div>
                    <div className="text-slate-500 dark:text-slate-300">:</div>
                    <div className="flex-1">
                        <input
                            value={ minutes }
                            onChange={ handleMinutesChange }
                            onBlur={ handleMinutesBlur }
                            onKeyDown={ handleMinutesKeyDown }
                            className={`appearance-none h-10 text-center w-full text-sm leading-tight  transition-all duration-300 ease-in-out 
                                rounded-md focus:ring-1 focus:ring-offset-0
                                border bg-transparent dark:bg-slate-700 text-slate-600 dark:text-slate-300  border-gray-300 dark:border-slate-600 outline-0 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-300 dark:focus:ring-primary-300
                                 ${ errorStyles }
                                `}
                        />
                    </div>
                    <div className="pl-1">
                        <button
                            type="button"
                            // onClick={() => setAp(ap === 'AM' ? 'PM' : 'AM')}
                            onClick={ adjustHours }
                            className="appearance-none h-10 hover:bg-slate-300 border-0 box-border text-[11px] cursor-pointer bg-slate-200 text-slate-700 flex px-2 items-center justify-center rounded-md dark:bg-slate-500 dark:text-slate-200"
                        >
                            { ap }
                        </button>
                    </div>
                    <input type="hidden" value={value}  {...rest} />
                </div>    
            </div>
            { error && ( <p className="mt-1 text-xs text-red-600">{ error }</p> ) }
        </div>
    )
}