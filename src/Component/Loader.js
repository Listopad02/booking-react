function Loader() {

  const styles = {
    loader: {
      width: 40,
      height: 40,
      position: 'relative',
      margin: "100px auto"
    }, 
    bounce1: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      backgroundColor: '#eee',
      opacity: 0.5,
      position: 'absolute',
      top: 0,
      left: 0,
      animation: 'sk-bounce 2s infinite ease-in-out'
    },
    bounce2: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      opacity: 0.5,
      position: 'absolute',
      top: 0,
      left: 0,
      animation: 'sk-bounce 2s infinite ease-in-out',
      backgroundColor: '#ccc',
      animationDelay: '-1s'
    },
  }

  return (
    <div className={styles.loader}>
      <div className={styles.bounce1} />
      <div className={styles.bounce2} />
    </div>
  );
}

export default Loader;
