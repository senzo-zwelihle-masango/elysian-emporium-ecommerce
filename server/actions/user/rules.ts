// "membership tier simulation here----decent bnut could be improved"

export const MembershipPointsRules = {
  welcome_bonus: 200,
  shopping: (amount: number) => Math.floor(amount * 50),
  add_to_favorites: 5,
  share_product: 15,
  write_review: 20,
  daily_login: 2,
  complete_profile: 50,
  refer_friend: 100,
  social_share: 10,
  newsletter_signup: 25,
  birthday: 200,
  product_interaction: 1,
  add_to_cart: 5,
  purchase_completed: (amount: number) => Math.floor(amount * 100),
}
