import Head from 'next/head'
import styles from '../../styles/home.module.scss';
import { useEffect, useState } from 'react';

import { api } from '@/services/api';
import ICombo from '@/interfaces/ICombo';
import IPromocao from '@/interfaces/IPromocao';
import Combo from '@/components/Combo';
import Header from '@/components/Header';
import Promocao from '@/components/Promocao';
import IClasse from '@/interfaces/IClasse';
import BoxProd from '@/components/Produto/BoxProd';
import SearchComponent from '@/components/Home/SearchComponent';

export default function Home() {

  const [combos, setCombos] = useState<ICombo[]>([]);
  const [promocoes, setPromocoes] = useState<IPromocao[]>([]);
  const [classes, setClasses] = useState<IClasse[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    var item = params.get('empresa') || '';
    if (item.length > 0) {
      sessionStorage.setItem('empresa', item);
      window.location.href = '/';
    } else {
      item = sessionStorage.getItem('empresa') || '';
    }
    loadDatas(item);
  }, []);
  async function loadDatas(empresa: string) {
    await setTimeout(() => { }, 500);
    api.get(`/MenuDigital/Combos/${empresa}`).then((r) => {
      setCombos(r.data);
    })
      .catch((r) => {
        console.log(r);
      });

    api.get(`/MenuDigital/Promocoes/${empresa}`).then((r) => {
      setPromocoes(r.data);
    })
      .catch((r) => {
        console.log(r);
      });

    api.get(`/MenuDigital/Produtos/${empresa}`).then((r) => {
      setClasses(r.data);
    })
      .catch((r) => {
        console.log(r);
      });
  }
  function getContain(classe: IClasse): boolean {
    let contain = false;
    if(classe.classe == search){
      return true;
    }
    classe.produtos.map((p, index) => {
      if(search.toUpperCase() == 'TODOS'){
        contain = true;
      }
      else if (p.nome.toUpperCase().includes(search.toUpperCase())) {
        contain = true;
      }
    });
    return contain;
  }
  return (
    <div className={styles.divPrincipal}>
      <Head>
        <title>KRD System - Menu Digital</title>
      </Head>
      <div className={styles.containerCenter}>
        <Header emp={undefined} />
        <SearchComponent handleSearchChange={setSearch} classes={classes}/>
        {/* <div className={styles.containerClasses}>
          {combos.length > 0 ? (
            <a className={styles.classeNavigator} href={`#combos`}>
              Combos
            </a>
          ) : (
            <a></a>
          )}
          {promocoes.length > 0 ? (
            <a className={styles.classeNavigator} href={`#promocoes`}>
              Promocoes
            </a>
          ) : (
            <a></a>
          )}
          {classes.map((c, index) => {
            let contain = getContain(c.produtos);
            if (!contain) {
              return (
                <></>
              )
            }
            return (
              <a className={styles.classeNavigator} key={index} href={'#' + c.classe + index}>
                <div >
                  {c.classe}
                </div>
              </a>

            )
          })}
        </div> */}
        {combos.length > 0 ? (
          <>
            <div className={styles.title} id="combos">Combos</div>
            <div className={styles.containerCombos}>
              {combos.map(c => {
                if (!c.codigo.toUpperCase().includes(search.toUpperCase()) &&
                  !c.descricao.toUpperCase().includes(search.toUpperCase())) {
                  return (<></>)
                }
                return (
                  <Combo key={c.idCombo}  {...c} />
                )
              })}
            </div>
          </>
        ) : (
          <a></a>
        )}
        {promocoes.length > 0 ? (
          <>
            <div className={styles.title} id="promocoes">Promocoes</div>
            <div className={styles.containerCombos}>
              {promocoes.map(c => {
                if (!c.descricao.toUpperCase().includes(search.toUpperCase())) {
                  return (<></>)
                }
                return (<Promocao key={c.idPromocao} {...c} />)
              })}
            </div>
          </>
        ) : (
          <a></a>
        )}
        <div style={{ width: '100%' }}>
        </div>
        <div className={styles.containerProds}>
          {classes.map((c, index) => {
            let contain = getContain(c);
            if (!contain) {
              return (
                <div key={index}></div>
              )
            }
            return (
              <div key={`${index}c`}>
                <div id={c.classe + index} className={styles.title}>{c.classe}</div>
                {c.produtos.map((p, ind) => {
                  if (search.toUpperCase() != 'TODOS' &&  !p.nome.toUpperCase().includes(search.toUpperCase()) &&
                    !p.descricao.toUpperCase().includes(search.toUpperCase()) && 
                     c.classe.toUpperCase() != search.toUpperCase()) {
                    return (<></>)
                  }
                  return (<BoxProd key={p.cod} {...p} />)
                })}
              </div>
            )
          }
          )}
        </div>
      </div>
    </div>
  )
}
