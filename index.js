const hreos = [
    {
        name: '薇恩',
        level: 2,
        hp: [500, 900, 1500], // 血量
        mp: 40, // 蓝量
        currentMp: 0, // 当前蓝量
        attack: [50, 100, 200], // 攻击力
        attackSpeed: 0.80, // 攻击速度
        physicalResist: 10, // 物理抗性
        magicResist: 10, // 魔法抗性
        attackDistance: 660, // 射程
        price: 1, // 买入价格
        salePrice: 1, // 卖出价格
        skill: {
            dsc: '每三次攻击就能造成最大生命值百分之${grow}的额外真实伤害', // 技能描述
            grow: [6, 9, 12] // 技能成长
        },

    }, {
        name: '野怪',
        hp: 10000, // 血量
        attack: 20, // 攻击力
        physicalResist: 100, // 物理抗性
        magicResist: 10, // 魔法抗性
        attackDistance: 180, // 射程
        attackSpeed: 0.60, // 攻击速度
    }
];

const me = hreos[0];
const boss = hreos[1];

/**
 * @summary 物理攻击伤害计算
 * @param {Object} attacker 攻击者
 * @param {Object} target 被攻击者
 */
const physicalAttack = (attacker, target) => {
    const attack = typeof attacker.attack === 'object' ? attacker.attack[attacker.level - 1] : attacker.attack; // 面板伤害
    const physicalResist = target.physicalResist; // 对手物抗
    const physicalReduction = physicalReductionFn(physicalResist); // 物理伤害减免
    const realAttack = Math.floor(attack * (1 - physicalReduction)); // 实际伤害
    return realAttack;
}

/**
 * @summary 物伤减免计算
 * @param {Nmuber} physicalResist 物理抗性值
 */
const physicalReductionFn = (physicalResist) => {
    return Math.pow(Math.log2(physicalResist) / 10, 2);
}

/**
 * @summary 技能攻击伤害计算
 * @param {Object} attacker 攻击者
 * @param {Object} target 被攻击者
 */
const skillAttack = (attacker, target) => {
    // 以薇恩为例
    switch (attacker.name) {
        case '薇恩':
            return target.hp * attacker.skill.grow[attacker.level - 1] / 100;
    }
}
/**
 * @summary 启动函数
 * @param {Object} attacker 攻击者
 * @param {Object} target 被攻击者
 */
const start = (attacker, target) => {
    const attackSpeed = attacker.attackSpeed;
    const targetSpeed = target.attackSpeed;
    let hp_t = target.hp;
    let hp_a = attacker.hp[attacker.level - 1];
    let count = 0;
    let timer = setInterval(() => {
        hp_t = hp_t - physicalAttack(attacker, target);
        count++;
        count % 3 === 0 && (hp_t = hp_t - skillAttack(attacker, target));
        if(hp_t <= 0){
            clearInterval(timer);
            console.log('you win!');
            clearInterval(timer2);
        }
    }, 1000 / attackSpeed);
    let timer2 = setInterval(() => {
        hp_a = hp_a - physicalAttack(target, attacker);
        if(hp_a <= 0){
            clearInterval(timer2);
            console.log('game over!');
            clearInterval(timer);
        }
    }, 1000 / targetSpeed);
}

start(me, boss);