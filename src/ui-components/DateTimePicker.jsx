import { useState, useEffect, useRef, forwardRef } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import {
    DatePickerStateProvider,
    useContextCalendars,
    useContextMonths,
    useContextYears,
    useContextMonthsPropGetters,
    useContextDatePickerOffsetPropGetters,
    useContextYearsPropGetters,
    useDatePickerStateContext
} from '@rehookify/datepicker'
import dayjs from 'dayjs'
import { Input } from './Input';
import { Icon } from './Icon';


const TimeInput = () => {
    const [ hours, setHours ] = useState( '00' );
    const [ minutes, setMinutes ] = useState( '00' );
    const [ ap, setAp ] = useState( 'AM' );
    const { selectedDates, config } = useDatePickerStateContext();

    // Helper to format hours and minutes (ensure it's a string)
    const formatTime = ( value ) => String( value ).padStart( 2, '0' );

    // Update time inputs based on the selected date
    useEffect( () => {
        if ( selectedDates?.length > 0 ) {
            const currentHours = dayjs( selectedDates[ 0 ] ).hour();
            const currentMinutes = dayjs( selectedDates[ 0 ] ).minute();

            setAp( currentHours < 12 ? 'AM' : 'PM' );
            setHours( formatTime( currentHours > 12 ? currentHours - 12 : currentHours ) );
            setMinutes( formatTime( currentMinutes ) );
        }
    }, [ selectedDates ] );

    // Handle hours input changes
    const handleHoursChange = ( e ) => {
        const value = e.target.value;
        if ( value.length <= 2 && /^[0-9]*$/.test( value ) ) {
            const parsedValue = Number( value );
            if ( parsedValue >= 1 && parsedValue <= 12 ) {
                setHours( value );
            }
        }
    };

    const handleHoursBlur = () => {
        const formattedHours = formatTime( hours );
        setHours( formattedHours );

        let updatedDate = dayjs( selectedDates[ 0 ] );
        const hoursValue = parseInt( formattedHours );
        updatedDate = ap === 'PM' ? updatedDate.hour( hoursValue + 12 ) : updatedDate.hour( hoursValue );

        config.onDatesChange( [ updatedDate.toDate() ] );
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

        let updatedDate = dayjs( selectedDates[ 0 ] ).minute( parseInt( formattedMinutes ) );
        config.onDatesChange( [ updatedDate.toDate() ] );
    };

    // Toggle AM/PM and update the date accordingly
    const adjustHours = () => {
        let updatedDate = dayjs( selectedDates[ 0 ] );
        const currentHours = updatedDate.hour();

        if ( ap === 'AM' && currentHours >= 12 ) {
            updatedDate = updatedDate.hour( currentHours - 12 );
        } else if ( ap === 'AM' && currentHours < 12 ) {
            updatedDate = updatedDate.hour( currentHours + 12 );
        } else if ( ap === 'PM' && currentHours < 12 ) {
            updatedDate = updatedDate.hour( currentHours + 12 );
        } else if ( ap === 'PM' && currentHours > 12 ) {
            updatedDate = updatedDate.hour( currentHours - 12 );
        }

        // setAp(ap === 'AM' ? 'PM' : 'AM');
        config.onDatesChange( [ updatedDate.toDate() ] );
    };

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


    return (
        <div className="flex flex-1 h-full flex-row justify-stretch space-x-1">
            <div className="flex-1 h-full">
                <input
                    value={ hours }
                    onChange={ handleHoursChange }
                    onBlur={ handleHoursBlur }
                    onKeyDown={ handleHoursKeyDown }
                    className="appearance-none h-7 text-center w-full p-0 text-sm rounded-md leading-tight border bg-transparent dark:bg-slate-700 text-slate-500 dark:text-slate-300 border-gray-300 dark:border-slate-600 outline-0 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-300 dark:focus:ring-primary-300"
                />
            </div>
            <div className="text-slate-500 dark:text-slate-300">:</div>
            <div className="flex-1">
                <input
                    value={ minutes }
                    onChange={ handleMinutesChange }
                    onBlur={ handleMinutesBlur }
                    onKeyDown={ handleMinutesKeyDown }
                    className="appearance-none h-7 text-center w-full p-0 text-sm rounded-md leading-tight border bg-transparent dark:bg-slate-700 text-slate-500 dark:text-slate-300 border-gray-300 dark:border-slate-600 outline-0 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-300 dark:focus:ring-primary-300"
                />
            </div>
            <div className="pl-1">
                <button
                    type="button"
                    onClick={ adjustHours }
                    className="appearance-none h-7 hover:bg-slate-300 border-0 box-border text-[11px] cursor-pointer bg-slate-200 text-slate-700 flex px-2 items-center justify-center rounded-md dark:bg-slate-500 dark:text-slate-200"
                >
                    { ap }
                </button>
            </div>
        </div>
    );
};


const Header = ( { offsetType = 'months', label, onChangeView } ) => {
    const { addOffset, subtractOffset } = useContextDatePickerOffsetPropGetters();
    const { nextYearsButton, previousYearsButton } = useContextYearsPropGetters();

    const handleChangeView = ( e ) => {
        e.preventDefault();
        switch ( offsetType ) {
            case 'months':
                onChangeView( 'YEAR' );
                break;
            case 'years':
                onChangeView( 'DECADE' );
                break;
            case 'decade':
                onChangeView( 'MONTH' );
                break;
            default:
                break;
        }
    };

    const renderButton = ( icon, actionProps, className ) => (
        <button type="button" { ...actionProps } className={ className }>
            { icon }
        </button>
    );

    const arrowIcon = ( direction ) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <g fill="none">
                <path
                    d={ direction === 'left'
                        ? 'M17.51 3.87L15.73 2.1 5.84 12l9.9 9.9 1.77-1.77L9.38 12l8.13-8.13z'
                        : 'M6.49 20.13l1.77 1.77 9.9-9.9-9.9-9.9-1.77 1.77L14.62 12l-8.13 8.13z' }
                    fill="currentColor"
                />
            </g>
        </svg>
    );

    return (
        <div className="flex  py-3 flex-row items-center space-x-5 justify-between select-none">
            <div className="flex-1">
                <div
                    tabIndex={ 0 }
                    role="button"
                    onClick={ handleChangeView }
                    onKeyDown={ ( e ) => e.key === 'Enter' && handleChangeView( e ) }
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 space-x-1 inline-flex cursor-pointer px-2 py-1.5 rounded-md"
                    >
                    <p className="text-sm text-slate-500 dark:text-slate-200">{ label }</p>
                    <div className="text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 9L12 3 6 9H18ZM18 15L12 21 6 15H18Z" />
                        </svg>
                    </div>
                </div>
            </div>

            { offsetType !== 'decade' ? (
                <>
                    { renderButton( arrowIcon( 'left' ), subtractOffset( { [ offsetType ]: 1 } ), "text-gray-400 hover:text-gray-600 disabled:opacity-20" ) }
                    { renderButton( arrowIcon( 'right' ), addOffset( { [ offsetType ]: 1 } ), "text-gray-400 hover:text-gray-600 disabled:opacity-20" ) }
                </>
            ) : (
                <>
                    { renderButton( arrowIcon( 'left' ), previousYearsButton(), "text-gray-400 hover:text-gray-600 disabled:opacity-20" ) }
                    { renderButton( arrowIcon( 'right' ), nextYearsButton(), "text-gray-400 hover:text-gray-600 disabled:opacity-20" ) }
                </>
            ) }
        </div>
    );
}


const Footer = ( { hasTime, onClose, onChangeView } ) => {

    const { config } = useDatePickerStateContext()

    const gotoNow = ( e ) => {
        e.stopPropagation();
        config.onOffsetChange( new Date() )
        config.onDatesChange( [ new Date() ] )
        onChangeView( 'MONTH' )
    }

    return (
        <div className="border-t border-slate-300 dark:border-slate-600  py-3">
            <div className="flex flex-row space-x-2">
                <div className="px-1">
                    <button className="appearance-none uppercase bg-slate-50 hover:bg-slate-100 dark:bg-slate-600/20 dark:hover:bg-slate-600/30  h-7 px-3 py-1 text-slate-600 dark:text-slate-300 cursor-pointer rounded-md text-xs" type="button" onClick={ gotoNow }>Today</button>
                </div>
                <div className="flex-1 h-full">
                    { hasTime && <TimeInput /> }
                </div>
                <div className="px-1">
                    {/* <button className="px-3 py-1 text-slate-600 bg-slate-100 cursor-pointer hover:bg-slate-200 rounded-md text-sm" type="button">Cancel</button> */ }
                    <button type="button" onClick={onClose} className="appearance-none uppercase bg-slate-50 hover:bg-slate-100 dark:bg-slate-600/20 dark:hover:bg-slate-600/30  h-7 px-3 py-1 text-slate-600 dark:text-slate-300 cursor-pointer rounded-md text-xs">OK</button>
                </div>
            </div>
        </div>
    )
}

const YearView = ( { onChangeView } ) => {

    const { calendars } = useContextCalendars();
    const { year } = calendars[ 0 ];
    const { selectedDates, config } = useDatePickerStateContext()

    const { monthButton } = useContextMonthsPropGetters()
    const { months } = useContextMonths()

    const onMonthClick = ( e, mon ) => {
        e.stopPropagation();
        const current_date = selectedDates[ 0 ] || new Date()
        const monthNumber = mon.getMonth()
        current_date.setMonth( monthNumber )
        config.onDatesChange( [ current_date ] )
        onChangeView( 'MONTH' )
    }



    const getMonthClassName = ( { active, now } ) => {
        let names = "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"

        if ( now )
            names = "border border-primary-500 hover"
        if ( active )
            names = "hover:bg-primary-500 bg-primary-500 text-white"
        return names;
    }



    return (
        <div className="pb-5">
            <Header label={ year } onChangeView={ onChangeView } offsetType='years' />
            <div className="px-5 py-2 grid grid-cols-3 gap-1">
                {
                    months?.map( ( dpMonth, dm ) =>
                        <button
                            type="button"
                            key={ dm }
                            className={ `h-10 hover:rounded-full text-[14px] rounded-full ${ getMonthClassName( dpMonth ) }` }
                            { ...monthButton( dpMonth, { onClick: onMonthClick } ) }
                        // onClick={(e) => onMonthClick(e, dpMonth)}
                        >
                            { dpMonth.month.substring( 0, 3 ) }
                        </button>
                    ) }
            </div>
        </div>
    )
}

const DecadeView = ( { onChangeView } ) => {

    const { yearButton } = useContextYearsPropGetters()
    const { years } = useContextYears()
    const { selectedDates, config } = useDatePickerStateContext()

    const onYearClick = ( evt, date ) => {
        // In case you need any action with evt
        evt.stopPropagation();

        const current_date = selectedDates[ 0 ] || new Date()
        const yearNumber = date.getFullYear()


        current_date.setFullYear( yearNumber )
        config.onDatesChange( [ current_date ] )

        onChangeView( 'YEAR' )
        // In case you need any additional action with date
        // console.log(date);
    }

    const getYerClassName = ( { active, now } ) => {
        let names = "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"

        if ( now )
            names = "border border-primary-500"
        if ( active )
            names = "hover:bg-primary-500 bg-primary-500 text-white"

        // console.log("Selected", selected, now, )
        return names;
    }


    return (
        <div className="pb-5">
            <Header label={ `${ years[ 0 ].year } - ${ years[ years.length - 1 ].year }` } onChangeView={ onChangeView } offsetType='decade' />
            <div className="px-5 py-2 grid grid-cols-3 gap-1">
                {
                    years?.map( ( dpYear, dy ) =>
                        <button type="button" key={ dy } className={ `h-10 hover:rounded-full  text-[14px] rounded-full ${ getYerClassName( dpYear ) }` } { ...yearButton( dpYear, { onClick: onYearClick } ) }>
                            { dpYear.year }
                        </button>
                    ) }
            </div>
        </div>
    )

}

const Calendar = ( { onChangeView } ) => {

    const { calendars, weekDays } = useContextCalendars();
    // const { dayButton } = useContextDaysPropGetters();
    const { year, month, days } = calendars[ 0 ];
    const { selectedDates, config } = useDatePickerStateContext()

    const onDayClick = ( date ) => {
        const slelectedDate = date.$date;
        let current_date = selectedDates[ 0 ] || new Date()
        let hours = current_date.getHours()
        let mins = current_date.getMinutes()
        slelectedDate.setHours( hours )
        slelectedDate.setMinutes( mins )
        config.onDatesChange( [ slelectedDate ] )
    }



    const getDayClassName = ( { selected, disabled, inCurrentMonth, now } ) => {


        let names = "text-slate-600 dark:text-slate-300"

        if ( !inCurrentMonth )
            names = "opacity-0 pointer-events-none"
        else if ( inCurrentMonth ) {
            names = "text-slate-600 dark:text-slate-300 hover:bg-primary-100 hover:text-primary-600 dark:hover:text-primary-600"
            if ( now )
                names = "border border-primary-500 dark:border-primary-200 text-slate-600 dark:text-slate-300"
            if ( selected )
                names = "hover:bg-primary-500 bg-primary-500 text-white"
            if(disabled)
                names = 'cursor-not-allowed opacity-20 events-none'
        }

        return names;
    }

    return (
        <div>
            <Header label={ `${ month } ${ year }` } onChangeView={ onChangeView } offsetType='months' />
            <div className="grid grid-cols-7 space-x-2  py-2 text-[12px] text-center uppercase">
                { weekDays.map( ( day, d ) => ( <div className='font-semibold text-slate-600 dark:text-slate-300' key={ d }>{ day }</div> ) ) }
            </div>

            <div className="py-2 grid grid-cols-7 gap-1">
                {
                    days?.map( ( dpDay, dp ) =>
                        <button
                            type="button" key={ dp }
                            className={ `aspect-square text-[14px] rounded-full  ${ getDayClassName( dpDay ) }` }
                            onClick={ () => onDayClick( dpDay ) }
                        // {...dayButton(dpDay, { onClick: () => onDayClick(dpDay) })}
                        >
                            { dpDay.day }
                        </button>
                    ) }
            </div>
        </div>
    )
}

export const CalendarPicker = ( { minDate = null, onClose, onSelect, maxDate = null, hasTime = false, format = "DD-MMMM-YYYY", defaultValue, timeFormat = "hh:mm a" } ) => {
    
    
    const [ selectedDates, onDatesChange ] = useState( defaultValue ? [ new Date( defaultValue ) ] : [ new Date() ] );
    const [ offsetDate, onOffsetChange ] = useState( defaultValue ? new Date( defaultValue ) : new Date() );
    
    
    const [ view, setView ] = useState( 'MONTH' )

    let datetimeFormat = format;
    let internalFormat = 'DD, MMMM YYYY ';
    if(hasTime){
        datetimeFormat = format + " " + timeFormat
        internalFormat = internalFormat + " hh:mm a"
    }

    // useEffect(() => {
    //     onSelect(dayjs(selectedDates[0] || new Date()).format(datetimeFormat))
    // }, [selectedDates, datetimeFormat, onSelect])

    const handleSelect = () => {
        onSelect(dayjs(selectedDates[0] || new Date()).format(datetimeFormat))        
        onClose()
    }
    useEffect(() => {
        if(defaultValue){
            onDatesChange([new Date(defaultValue)])
            onOffsetChange(new Date(defaultValue))            
        }
    }, [defaultValue ])

    useEffect(() => {
        if(selectedDates?.length > 0){            
            // if(minDate && dayjs(minDate).isAfter(dayjs(selectedDates[0]))){

            //     // console.log('MinDate', minDate)
            //     // onDatesChange([new Date(minDate)])
            //     // onSelect(new Date(minDate).format(datetimeFormat))
            // }
            if(maxDate && dayjs(maxDate).isBefore(dayjs(selectedDates[0]))){
                onDatesChange([new Date(maxDate)])
                onOffsetChange(new Date(maxDate))                
                // onSelect(new Date(maxDate).format(datetimeFormat))
            }
        }

    }, [minDate, maxDate, selectedDates ])

    return (
        <div className="">
            <DatePickerStateProvider
                config={ {
                    selectedDates,
                    onDatesChange,
                    offsetDate,                    
                    onOffsetChange,                    
                    dates: {
                        mode: 'single',                        
                        ...minDate && { minDate: new Date(minDate)},
                        ...maxDate && { maxDate: new Date(maxDate)}
                    },
                    calendar: {
                        startDay: 1,
                        mode: "fluid"
                    }

                } }>
                <div className="border-0 px-4 border-slate-300 dark:border-slate-600 w-80">
                    <div className="text-md px-3 text-slate-500 dark:text-slate-200 border-b font-medium py-3 border-slate-300 dark:border-slate-600">
                        {
                            ( selectedDates?.length > 0 ) ? dayjs( selectedDates[ 0 ] ).format( internalFormat ) : dayjs().format( internalFormat )
                        }
                    </div>
                    { view === 'MONTH' && <Calendar onChangeView={ setView } /> }
                    { view === 'YEAR' && <YearView onChangeView={ setView } /> }
                    { view === 'DECADE' && <DecadeView onChangeView={ setView } /> }
                    <Footer onClose={handleSelect} hasTime={hasTime} onChangeView={ setView } />                    
                </div>
            </DatePickerStateProvider>

            
        </div>
    )    
}

export const DateTimePicker = forwardRef(( {label, minDate, error, maxDate, placeholder, onChange, defaultValue, required, ...rest }, ref ) => {

    const inputRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const [ innverValue, setInnerValue ] = useState('')
    const [ defaultVal, setDefaultVal ] = useState(defaultValue ? new Date(defaultValue) : null)

    const handleOnSelect = (value) => {        
        inputRef.current.value = value        
        if(onChange){
            onChange(value ? new Date(value) : null)            
        }
        // console.log(inputRef.current)
        setInnerValue(value ? dayjs(value).format() : '')
    }

    useEffect(() => {
        if(isOpen){
            if(inputRef?.current?.value){
                setDefaultVal(inputRef?.current?.value)
            }
        }
    }, [isOpen])

    useEffect(() => {
        if(defaultValue){
            setInnerValue(dayjs(defaultValue).format())
        }        
    }, [defaultValue])    

    useEffect(() => {
        if(minDate){
            setDefaultVal(minDate)
        }
    }, [minDate])
        
    return( 
        <div ref={ref}>
            <Input 
                ref={inputRef}
                readOnly       
                label={label}     
                error={error}  
                required={required}           
                defaultValue={defaultValue ? dayjs(defaultValue).format(rest?.format || 'DD-MMMM-YYYY') : null }                   
                suffix={<Icon className="mr-2" name="calendar-event-line" />}
                placeholder={placeholder}
                onClick={() => setIsOpen(true)}
            />
            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={() => setIsOpen(false)}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/70">
                    <div className="flex min-h-full items-center justify-center">
                        <DialogPanel
                            transition
                            className="w-auto rounded-lg bg-white dark:bg-slate-800 py-2  duration-200 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                            >
                            <CalendarPicker 
                                minDate={minDate}
                                maxDate={maxDate}
                                defaultValue={defaultVal} 
                                onClose={() => setIsOpen(false)} 
                                onSelect={handleOnSelect}  
                                {...rest} 
                            />
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
            <input type="hidden" value={innverValue ||  ''} {...rest} />
        </div>
    )
    

})

DateTimePicker.displayName="DateTimePicker"