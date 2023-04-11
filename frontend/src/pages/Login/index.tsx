import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { post } from '../../services/functions';
import { clearAll, setItem } from '../../utils/storage';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  function handleInputForm(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target?.name]: e.target?.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const { data, status } = await post('/login', {
        email: form.email,
        password: form.password,
      });

      if (status > 299) {
        return toast.error(data.message);
      }
      
      setItem('token', data.token);

      setTimeout(() => navigate('/home'), 1000);
      return toast.success('Boas vindas');
    } catch (error: any) {
      return toast.error(error.message);
    }
  }
  useEffect(()=>{
clearAll()
  },[])

  return (
    <div className='Login'>
      <section>
        <h1>Challenge Guilherme</h1>
      </section>
      <section>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type='email'
              value={form.email}
              name='email'
              onChange={handleInputForm}
            />
          </div>
          <div>
            <label>Senha</label>
            <input
              type='password'
              value={form.password}
              name='password'
              onChange={handleInputForm}
            />
          </div>
          <button type='submit'>Entrar</button>
        </form>
      </section>
    </div>
  );
}

export default Login;
