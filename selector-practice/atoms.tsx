import { atom, selector } from 'recoil';

export const minuteState = atom({
  key: 'minutes',
  default: 0,
});

//selector 사용이유 - 최소한의 상태 집합만 atoms에 저장하고 다른 모든 파생되는 데이터는 selectors에 명시한 함수를 통해 효율적으로 계산함으로써 쓸모없는 상태의 보존을 방지한다.
//selector 는 하나의 atom만을 get,set하지 않고 모든 아톰의 값을 사용할 수 있다.

//get - 파생된 상태의 값을 평가하는 함수
//set - 이 속성이 설정되면 selector 는 read-only에서 쓰기 가능한 상태로 바뀐다.
export const hourSelector = selector<number>({
  key: 'hours',
  get: ({ get }) => {
    const minutes = get(minuteState);
    return minutes / 60;
  },
  set: ({ set }, newValue) => {
    const minutes = Number(newValue) * 60;
    set(minuteState, minutes);
  },
});
