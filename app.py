import streamlit as st
from datetime import date, datetime

def calculate_class(birth_date, ref_year):
    # Cut-off date: March 31st of the reference year
    cutoff_date = date(ref_year, 3, 31)
    
    # Calculate age on cut-off date
    age = cutoff_date.year - birth_date.year - ((cutoff_date.month, cutoff_date.day) < (birth_date.month, birth_date.day))
    
    # Specific ranges for Maternal (Parcial)
    # Born between 01/04 of previous year and 01/10 of previous year
    maternal_start = date(ref_year - 1, 4, 1)
    maternal_end = date(ref_year - 1, 10, 1)
    
    if maternal_start <= birth_date <= maternal_end:
        return "Maternal (Parcial)"
    
    # Check by age on 31/03
    if age == 1:
        return "Maternal I (Parcial)"
    elif age == 2:
        return "Maternal II (Integral)"
    elif age == 3:
        return "Maternal III (Parcial)"
    elif age == 4:
        return "1º Período (Parcial)"
    elif age == 5:
        return "2º Período (Parcial)"
    elif age < 1:
        # If younger than Maternal (Parcial)
        if birth_date > maternal_end:
            return "Muito novo(a) para as classes disponíveis."
        else:
            # This case is tricky, but logically if age < 1 and not in Maternal Parcial range
            return "Muito novo(a) para as classes disponíveis."
    else:
        # age > 5
        return "Muito velho(a) para as classes da Educação Infantil."

def main():
    st.set_page_config(page_title="Calculadora de Classe Escolar", page_icon="🏫")
    
    # 1. Título no topo
    st.title("Calculadora de classe escolar")
    st.markdown("Identifique a classe escolar de uma criança com base na data de nascimento e data de corte (31/03).")
    
    st.divider()

    # 2. Entradas e Botão
    col1, col2 = st.columns(2)
    with col1:
        ref_year = st.number_input("Ano de Referência", min_value=2000, max_value=2100, value=2026)
    with col2:
        # value=None deixa o campo vazio inicialmente
        birth_date = st.date_input(
            "Data de Nascimento da Criança", 
            value=None,
            min_value=date(ref_year - 15, 1, 1),
            max_value=date(ref_year, 12, 31),
            format="DD/MM/YYYY",
            help="Digite a data no formato DD/MM/AAAA."
        )
    
    if st.button("Verificar Classe", use_container_width=True):
        if birth_date is None:
            st.error("Por favor, insira uma data de nascimento válida.")
        else:
            result = calculate_class(birth_date, ref_year)
            st.session_state['result'] = result
            st.session_state['age_on_cutoff'] = date(ref_year, 3, 31).year - birth_date.year - ((3, 31) < (birth_date.month, birth_date.day))
            st.session_state['ref_year_used'] = ref_year

    # 3. Região do Resultado logo abaixo do botão
    if 'result' in st.session_state:
        st.markdown("---")
        st.subheader("🔍 Resultado da Consulta")
        res = st.session_state['result']
        age_on_cutoff = st.session_state['age_on_cutoff']
        ref_year_used = st.session_state['ref_year_used']
        
        if "Muito" in res:
            st.warning(res)
        else:
            st.success(f"A criança pertence à classe: **{res}**")
            st.info(f"Idade em 31/03/{ref_year_used}: **{age_on_cutoff} ano(s)**")

    st.divider()

    # 4. Intervalos de cálculo no final
    st.subheader("📅 Intervalos de Cálculo")
    st.write(f"Baseado no ano de referência: **{ref_year}**")
    
    intervals = [
        ("2º Período", date(ref_year - 6, 4, 1), date(ref_year - 5, 3, 31)),
        ("1º Período", date(ref_year - 5, 4, 1), date(ref_year - 4, 3, 31)),
        ("Maternal III", date(ref_year - 4, 4, 1), date(ref_year - 3, 3, 31)),
        ("Maternal II", date(ref_year - 3, 4, 1), date(ref_year - 2, 3, 31)),
        ("Maternal I", date(ref_year - 2, 4, 1), date(ref_year - 1, 3, 31)),
        ("Maternal (Parcial)", date(ref_year - 1, 4, 1), date(ref_year - 1, 10, 1)),
    ]
    
    cols = st.columns(3)
    for i, (name, start, end) in enumerate(intervals):
        with cols[i % 3]:
            st.markdown(f"**{name}**")
            st.caption(f"{start.strftime('%d/%m/%Y')} a {end.strftime('%d/%m/%Y')}")
            st.write("")

if __name__ == "__main__":
    main()
