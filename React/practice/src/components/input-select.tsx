import React, { KeyboardEventHandler, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import Chip from '@mui/material/Chip';
import { hashtagMock } from '../mocks/options-select-mock';

// #region constants
// #endregion


const components = {
  DropdownIndicator: null,
  // Option: TagOption,
};

const HASHTAG_MAX = 5

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string) => ({
  label,
  value: label,
});

const createMultipleOptions = (arrayLabels: string[]) => {
  const options = arrayLabels.map((label) => createOption(label));
  return options;
}


export interface HashtagsData {
  results: HashtagOption[];
  count: number;
  page: number;
  pages: number;
  limit: number;
}

export interface HashtagOption {
  value : string;
  usedCount: string;
}
/**
 * 
 */
const InputSelect =() => {
  const hashtagOptions = hashtagMock.results.map((hashtag) => createOption(hashtag.value));
  // console.log(hashtagOptions);

  const [inputValue, setInputValue] = React.useState<any>(''); //lo que va escribiendo el user
  console.log('inputValue',inputValue);

  const [value, setValue] = React.useState<readonly Option[]>([]);//values en el input para mandar al bavk despues d separar labels
  // console.log('value',value);
  const [options, setOptions] = React.useState<readonly Option[]>(hashtagOptions);
  // console.log('options',options);

  const [showSuggestions, setShowSuggestions] = React.useState(false);
  // console.log('showSuggestions',showSuggestions);
  
  const [suggestions, setSuggestions] = React.useState<readonly Option[]>([]);
  // console.log('suggestions',suggestions);

  const checkForValidHashtag = (inputValue: string) => {
    
    if(inputValue.startsWith('#')){
      return inputValue;
    }else{
      return `#${inputValue}`;
    }

  }

  const handleKeyDown: KeyboardEventHandler = (event: { key: any; preventDefault: () => void; }) => {
    if (!inputValue) return;
    if (value.length >= HASHTAG_MAX) {
      alert(`You have reached the maximum number of hashtags (${HASHTAG_MAX})`);
      event.preventDefault();
      return;
    };

    switch (event.key) {
      case 'Enter':
      case ' ':
      const hashtags = inputValue.split('#').filter((tag: string) => tag.trim() !== '');
      const newOptions = createMultipleOptions(hashtags.map(checkForValidHashtag));
      setValue((prev) => [...prev, ...newOptions]);
      setInputValue('');
      handleSuggestions();
      event.preventDefault();
      break;

      default:
        break;
    }
  };

  const handleSuggestions = () => {
    const inputValueLength = inputValue.length;
    console.log('inputValueLength',inputValueLength);

    if (inputValueLength > 0) {
      const filteredSuggestions = options.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()));
      console.log('filteredSuggestions',filteredSuggestions);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    }
    else {
      setShowSuggestions(false);
    }

  }

  const hashtagsParaElBack = value.map((hashtag) => hashtag.value);
  console.log('hashtagsParaElBack',hashtagsParaElBack);

  const spliceHashtag = (hashtag: string) => {
    console.log('hashtag en spliceHAsh',hashtag);
    let hashtagArray = hashtag.split('#').filter((hashtag) => hashtag.length > 1);
    // let hashtagArraySpliced = hashtagArray.splice(1,hashtagArray.length);
    const formatedHashes = hashtagArray.map((hashtag) => `#${hashtag}`);
    return formatedHashes.join(' ');
  }
  
  console.log('spliceHashtag',spliceHashtag('######hola'));


  const hastagValidator = (hash: string) => {
    let hashtag = [];

    if(hash.startsWith('#')){
      hashtag.push(hash);
    }else{
      hashtag.push(`#${hash}`);
    }

    

    return hashtag
  }


  console.log('hastagValidator',hastagValidator(inputValue));



  useEffect(() => {
    handleSuggestions();
  }, [inputValue]);

  return (
    <>
      <CreatableSelect
        components={components}
        inputValue={inputValue.length > 0 ? checkForValidHashtag(inputValue) : ''}
        menuIsOpen={showSuggestions}
        isClearable
        isMulti
        onChange={(newValue) => setValue(newValue)}
        onInputChange={(newValue) => setInputValue(newValue)}
        onKeyDown={handleKeyDown}
        placeholder="Type something and press enter..."
        value={value}
        options={options}
        isSearchable
        noOptionsMessage={() => null}
        formatCreateLabel={(inputValue) => `${inputValue}`}
        styles={{
          control: (provided) => ({
            ...provided,
            width: '100%',
          }),
          clearIndicator: (provided) => ({
            ...provided,
            cursor: 'pointer',
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            cursor: 'pointer',
            // color: 'red',
          }),
          multiValue: (provided) => ({
            ...provided,
            // backgroundColor: 'red',
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            // backgroundColor: 'red',

            
          }),
          multiValueRemove: (provided) => ({
            ...provided,
            cursor: 'pointer',
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#eee' : 'transparent',
            color: state.isFocused ? '#000' : '#000',
            cursor: 'pointer',
          }),
          valueContainer: (provided) => ({
            ...provided,
            height: 40,
          }),

        }}

      />

    </>
  );
}

export default InputSelect;