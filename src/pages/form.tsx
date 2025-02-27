export default function Form() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Bem-vindo ao Formulário!
        </h1>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Seu nome</label>
            <input
              type="text"
              placeholder="Digite seu nome"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary-color"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-color text-white p-2 rounded hover:bg-primary-color/90"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
