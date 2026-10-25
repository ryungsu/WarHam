window.WARHAMMER_STRATAGEM_TRANSLATIONS = {
  schemaVersion: 1,
  edition: "11",
  sourceRepository: "pguetschow/warhammer-40k-stratagem-card-generator",
  sourceUrl: "https://assets.warhammer-community.com/eng_01-06_warhammer40k_new40k_core_rules-was6fbu1ix-hfewhmxyiy.pdf",
  translations: [
    {
      id: "core11-crushing-impact",
      name: "분쇄 충격",
      source: {
        when: "Your Charge phase, just after a friendly <b>MONSTER/VEHICLE</b> unit ends a <b>charge move</b>.",
        target: "That <b>MONSTER/VEHICLE</b> unit.",
        effect: "Resolve the following sequence:<br>1. Select one enemy unit <b>engaged</b> with your unit.<br>2. Select one model in your unit <b>engaged</b> with that enemy unit.<br>3. Roll a number of D6 equal to the T characteristic of that model: for each 1, your unit suffers 1 <b>mortal wound</b>; for each 5+, that enemy unit suffers 1 <b>mortal wound</b> (to a maximum of 6 <b>mortal wounds</b> per unit)."
      },
      when: "당신의 돌격 단계에 아군 몬스터/차량 유닛이 돌격 이동을 마친 직후.",
      target: "해당 몬스터/차량 유닛.",
      effect: "다음 순서로 해결합니다:\n1. 당신의 유닛과 교전 중인 적 유닛 하나를 선택합니다.\n2. 그 적 유닛과 교전 중인 당신의 유닛 내 모델 하나를 선택합니다.\n3. 해당 모델의 내구력(T) 수치와 같은 수의 D6을 굴립니다. 결과가 1인 주사위마다 당신의 유닛은 모탈 운드 1개를 입습니다. 결과가 5+인 주사위마다 해당 적 유닛은 모탈 운드 1개를 입습니다(유닛당 모탈 운드 최대 6개)."
    }
  ]
};
