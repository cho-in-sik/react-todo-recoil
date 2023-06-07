export const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    //setSelf - atom 값을 설정한다. 주로 storage의 데이터를 atom에 넣어줄때 사용
    //onSet - atom의 변화를 감지해 storage에 데이터를 저장한다.
    const savedValue = localStorage.getItem(key);

    if (savedValue != null) {
      //문자열을 json형식으로
      setSelf(JSON.parse(savedValue));
    }
    // setSelf() 함수 내에서는 Promise를 사용하거나 데이터를 비동기적으로 호출할 때 사용할 수 있다.

    onSet((newValue: string) => {
      // newValue 값의 길이가 0일 때
      // userlist에 대한 값을 삭제해주면 된다.
      const confirm = newValue.length === 0;
      confirm
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };
