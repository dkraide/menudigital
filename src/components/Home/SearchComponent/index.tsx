import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles.module.scss';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import IClasse from '@/interfaces/IClasse';
import { useEffect, useState } from 'react';
import CustomButton from '@/components/CustomButton';


type searchProps = {
    classes?: IClasse[];
    handleSearchChange: (strSearch) => void;
}
type props = {
    str: string
    searchEnabled: boolean
}
export default function SearchComponent({ classes,handleSearchChange }: searchProps) {
    const [search, setSearch] = useState<props>({ str: '', searchEnabled: false })
    const [selected, setSelected] = useState('Todos');

    const BoxItem = ({ text }) => {
        return (
            <div onClick={() => {setSelected(text); handleSearchChange(text)}} className={styles[selected == text ? 'boxSelected' : 'box']}>
                <div>
                    {text}
                </div>
            </div>
        )
    }

    if (search.searchEnabled) {
        return (
            <div className={styles.container}>
                <div style={{width: '100%'}} className={styles.items}>
                    <input className={styles.searchInput} placeholder={'Pesquisar'} type={'text'} value={search.str} onChange={(v) => {setSearch({...search, str: v.currentTarget.value}); handleSearchChange(v.currentTarget.value)}} />
                    <button className={styles.btnSearch} onClick={() => {setSearch({...search, searchEnabled: false, str: ''}), handleSearchChange('')}}>Cancelar</button>
                </div>
            </div>
        )

    }
    return (
        <div className={styles.container}>
            <div
             onClick={() => {setSearch({...search, searchEnabled: true})}}
             style={{marginLeft: 10, marginRight: 20, cursor: 'pointer', fontSize: '18px', color: 'var(--gray)' }}>
                <FontAwesomeIcon icon={faSearch} />
            </div>
            <div className={styles.items}>
                <BoxItem text={'Todos'}/>
                {classes?.map((classe) => <BoxItem text={classe.classe} />)}
            </div>
        </div>

    )
}