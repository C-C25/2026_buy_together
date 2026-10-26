import { IsEmail, IsString, Length } from 'class-validator';

export class AuthRegisterDto {
  // todo dto 메세지 일반화 생각
  @IsEmail(
    {},
    {
      message: '올바른 이메일 형식이 아닙니다.',
    },
  )
  email!: string;

  @IsString()
  @Length(4, 16, {
    message: '닉네임은 4~16자 내로 입력해주세요.',
  })
  nickname!: string;

  @IsString()
  @Length(8, 17, {
    message: '비밀번호는 8~17자 내로 입력해주세요.',
  })
  password!: string;
}
