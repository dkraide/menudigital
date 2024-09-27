import styles from './styles.module.scss';
import { InputHTMLAttributes, forwardRef } from 'react';
import React from "react";
import InputMask from 'react-input-mask';
import { isMobile } from 'react-device-detect';

interface inputProps extends InputHTMLAttributes<HTMLInputElement> {
    title: string
    width?: string
    minWidth?: string
    invalid?: boolean
}

const InputGroup = forwardRef<HTMLInputElement, inputProps>(function MyInput(props, ref) {
    const { title, width, minWidth, invalid, name,...rest  } = props;
    return (
        <div className={styles["group"]} style={{ width: width || '100%', minWidth: isMobile ? '50%' : minWidth || 'auto' }}>
            <span>{title}</span>
            <input type="text"  {...rest} name={name} />
        </div>
    )
});

interface inputFormMask extends InputHTMLAttributes<HTMLInputElement> {
    title: string
    width?: string
    minWidth?: string
    invalid?: boolean
    errors?: any
    register?: any,
    mask: string

}
const InputFormMask = ({ mask, title, width, minWidth, register, errors, ...rest }: inputFormMask) => {
    return (
        <div className={styles["group"]} style={{ width: width || '100%', minWidth: isMobile ? '50%' : minWidth || 'auto' }}>
            <span>{title}</span>
            <InputMask  {...rest} mask={mask} />
        </div>
    );
};

export { InputGroup, InputFormMask };


