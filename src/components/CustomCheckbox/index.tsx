import styles from './styles.module.scss';

type customCheckboxTypes = {
   desc: string;
   selected: boolean;
   onChange: () => void;
}
export default function CustomCheckbox({desc, selected, onChange}: customCheckboxTypes){
    return(
        <label className={styles.container}>{desc}
        <input checked={selected} onChange={onChange} type="checkbox" className={styles.checked}/>
        <span className={styles.checkmark}></span>
      </label>
    )
}