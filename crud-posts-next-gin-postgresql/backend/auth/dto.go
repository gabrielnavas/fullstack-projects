package auth

type SigninDto struct {
	Username string `json:"username"`
	Token    string `json:"token"`
}
