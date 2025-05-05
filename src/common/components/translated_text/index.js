import React from 'react';

function useTranslation() {
    const translateIndex = React.useContext(TranslationContext);
    return translateIndex.state.languageIndex;
}

export function useTranslationData() {
    const {dispatch, state: {languageIndex}} = React.useContext(TranslationContext);
    return {translationDispatch: dispatch, languageIndex};
}

const TranslationContext = React.createContext();

const TranslatedText = ({textArray, defaultText}) => {
    const translateIndex = useTranslation();

    const renderTranslatedText = () => {
        if (typeof translateIndex !== 'number' || !Array.isArray(textArray) || translateIndex > textArray.length) {
             return defaultText;
        } else {
            return textArray[translateIndex]
        }
    }
    return (
        <React.Fragment>
            {renderTranslatedText()}
        </React.Fragment>
    )
}

const getLocalData = (key) => {
    let data;
    try {
        data = parseInt(localStorage.getItem(key));
    } catch (error) {
        
    }
    return data;
}

const saveLocalData = (key, data) => {
    try {
        localStorage.setItem(key, data);
    } catch (error) {
        
    }
}

const initialState = {
    languageIndex: getLocalData("languageIndex") || 0,
};

console.log("Initial starte:", initialState);

const TranslationReducer = (state=initialState, action) => {
    switch(action.type) {
        case 'SWITCH_LANGUAGE':
            return {
                languageIndex: action.data,
            }
        default:
            return state;
    }
}

export const TranslationProvider = ({children}) => {
    const [state, dispatch] = React.useReducer(
        TranslationReducer,
        initialState
    );

    return (
        <TranslationContext.Provider value={{ state, dispatch }}>
            {children}
        </TranslationContext.Provider>
    )
}

export const withTranslation = (Component) => {
    const WrapperComponent = () => {
        return (
            <TranslationProvider>
                {Component}
            </TranslationProvider>
        )
    }
    return WrapperComponent;
}

export const TranslationActions = {
    switchLanguage: (index, saveOnLocalStore = true) => {
        if (saveOnLocalStore) {
            saveLocalData("languageIndex", index);
        }
        return {
            type: 'SWITCH_LANGUAGE',
            data: index,
        }
    },
}

export default TranslatedText;
