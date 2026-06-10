import { type FormEvent, useEffect, useState } from 'react';
import { emptyForms, entitySingularLabels } from '../../constants/entities';
import { api } from '../../Services/apiService';
import {
  getCityCoordinates,
  getCityPopulation,
  getCountryDetails,
  listCitiesByCountry,
  listExternalCountries,
} from '../../Services/geographyService';
import type { Entity, Option, RecordData, RestCountryOption } from '../../types/entities';
import styles from './EntityForm.module.css';

type Props = {
  entity: Entity;
  editing: RecordData | null;
  continents: Option[];
  countries: Option[];
  onClose: () => void;
  onSaved: () => void;
};

export default function EntityForm({
  entity,
  editing,
  continents,
  countries,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState<RecordData>({ ...emptyForms[entity] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [externalLoading, setExternalLoading] = useState(false);
  const [restCountries, setRestCountries] = useState<RestCountryOption[]>([]);
  const [externalCities, setExternalCities] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  useEffect(() => {
    setForm(editing ? { ...editing } : { ...emptyForms[entity] });
    setError('');
    setExternalCities([]);
  }, [editing, entity]);

  useEffect(() => {
    if (entity !== 'paises') return;

    listExternalCountries()
      .then(setRestCountries)
      .catch((err: Error) => setError(err.message));
  }, [entity]);

  function update(field: string, value: string | number) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function completeCountry(countryName: string) {
    if (!countryName) return;

    setExternalLoading(true);
    setError('');

    try {
      const data = await getCountryDetails(countryName);
      setForm((current) => ({ ...current, ...data, nome: countryName }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha na consulta.');
    } finally {
      setExternalLoading(false);
    }
  }

  async function loadCitiesFromCountry(countryId: string) {
    update('pais_id', countryId);
    update('nome', '');
    update('latitude', '');
    update('longitude', '');
    setExternalCities([]);

    const country = countries.find((item) => item.id === Number(countryId));
    if (!country) return;

    setCitiesLoading(true);
    setError('');

    try {
      const cities = await listCitiesByCountry(country.nome);
      setExternalCities(cities);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao buscar cidades.');
    } finally {
      setCitiesLoading(false);
    }
  }

  async function selectCity(cityName: string) {
    update('nome', cityName);
    update('latitude', '');
    update('longitude', '');
    update('populacao', '');

    const country = countries.find((item) => item.id === Number(form.pais_id));
    if (!cityName || !country) return;

    setExternalLoading(true);
    setError('');

    try {
      const coordinates = await getCityCoordinates(cityName, country.nome);
      const population = await getCityPopulation(cityName, country.nome);

      setForm((current) => ({
        ...current,
        ...coordinates,
        nome: cityName,
        populacao: population ?? '',
      }));
    } catch {
      setError('Não foi possível buscar os dados da cidade.');
    } finally {
      setExternalLoading(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api(`/${entity}${editing ? `/${editing.id}` : ''}`, {
        method: editing ? 'PUT' : 'POST',
        body: JSON.stringify(form),
      });

      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <section className={styles.modal} onMouseDown={(event) => event.stopPropagation()}>
        <header className={styles.header}>
          <div>
            <span className="eyebrow">REGISTRO</span>
            <h2>
              {editing ? 'Editar' : 'Adicionar'} {entitySingularLabels[entity]}
            </h2>
          </div>

          <button className={styles.close} onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </header>

        <form className={styles.form} onSubmit={submit}>
          {entity === 'paises' && (
            <label>
              Nome
              <select
                value={String(form.nome ?? '')}
                onChange={(event) => {
                  update('nome', event.target.value);
                  completeCountry(event.target.value);
                }}
                required
              >
                <option value="">Selecione um país</option>
                {restCountries.map((country) => (
                  <option key={country.nomeEn} value={country.nomeEn}>
                    {country.nomePt}
                  </option>
                ))}
              </select>
            </label>
          )}

          {entity === 'continentes' && (
            <>
              <label>
                Nome
                <input
                  value={String(form.nome ?? '')}
                  onChange={(event) => update('nome', event.target.value)}
                  required
                />
              </label>

              <label className={styles.wide}>
                Descrição
                <textarea
                  value={String(form.descricao ?? '')}
                  onChange={(event) => update('descricao', event.target.value)}
                  required
                />
              </label>
            </>
          )}

          {entity === 'paises' && (
            <>
              {externalLoading && <p className={styles.wide}>Buscando dados do país...</p>}

              <label>
                População
                <input
                  type="number"
                  min="0"
                  value={String(form.populacao ?? '')}
                  onChange={(event) => update('populacao', event.target.value)}
                  required
                />
              </label>

              <label>
                Idioma oficial
                <input
                  value={String(form.idioma_oficial ?? '')}
                  onChange={(event) => update('idioma_oficial', event.target.value)}
                  required
                />
              </label>

              <label>
                Moeda
                <input
                  value={String(form.moeda ?? '')}
                  onChange={(event) => update('moeda', event.target.value)}
                  required
                />
              </label>

              <label>
                Continente
                <select
                  value={String(form.continente_id ?? '')}
                  onChange={(event) => update('continente_id', event.target.value)}
                  required
                >
                  <option value="">Selecione</option>
                  {continents.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.wide}>
                URL da bandeira
                <input
                  type="url"
                  value={String(form.bandeira ?? '')}
                  onChange={(event) => update('bandeira', event.target.value)}
                />
              </label>
            </>
          )}

          {entity === 'cidades' && (
            <>
              <label>
                País
                <select
                  value={String(form.pais_id ?? '')}
                  onChange={(event) => loadCitiesFromCountry(event.target.value)}
                  required
                >
                  <option value="">Selecione um país</option>
                  {countries.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Cidade
                <select
                  value={String(form.nome ?? '')}
                  onChange={(event) => selectCity(event.target.value)}
                  disabled={!form.pais_id || citiesLoading}
                  required
                >
                  <option value="">
                    {citiesLoading ? 'Carregando cidades...' : 'Selecione uma cidade'}
                  </option>

                  {externalCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>

              {externalLoading && (
                <p className={styles.wide}>Buscando coordenadas e população...</p>
              )}

              <label>
                População
                <input
                  type="number"
                  min="0"
                  value={String(form.populacao ?? '')}
                  onChange={(event) => update('populacao', event.target.value)}
                  required
                />
              </label>

              <label>
                Latitude
                <input
                  type="number"
                  step="any"
                  value={String(form.latitude ?? '')}
                  onChange={(event) => update('latitude', event.target.value)}
                  required
                />
              </label>

              <label>
                Longitude
                <input
                  type="number"
                  step="any"
                  value={String(form.longitude ?? '')}
                  onChange={(event) => update('longitude', event.target.value)}
                  required
                />
              </label>
            </>
          )}

          {error && <p className={`formError ${styles.wide}`}>{error}</p>}

          <div className={`${styles.actions} ${styles.wide}`}>
            <button type="button" className="secondaryButton" onClick={onClose}>
              Cancelar
            </button>

            <button className="primaryButton" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar registro'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
