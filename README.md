# Zxpmob — Developer Portfolio

پورتفولیوی آنلاین من به‌عنوان یک برنامه‌نویس؛ یک صفحه‌ی تک‌صفحه‌ای (Single Page)، کاملاً دوزبانه (فارسی/انگلیسی) با یک پنل مدیریت اختصاصی پشت صحنه.

🔗 **دمو:** بعد از دیپلوی، آدرس سایتت رو اینجا بذار — مثلاً `https://zxpmob.github.io`

---

## درباره‌ی طراحی

ایده‌ی اصلی طراحی، حس یک محیط کدنویسی شب‌هنگام بود: تیره، آرام، ولی زنده.

- **تم رنگی:** پس‌زمینه‌ی تقریباً مشکی (`#060613`) در کنار یک گرادینت بنفش-آبی (ایندیگو → وایولت → آبی) که هم به عنوان لوگو و تیتر‌ها، هم دکمه‌ها و هایلایت‌ها استفاده شده. این گرادینت نخ اصلی هویت بصری سایته و توی همه‌ی بخش‌ها (سایت اصلی، مودال ورود، پنل ادمین) تکرار می‌شه تا حس یکپارچه بده.
- **افکت بارش کد:** پس‌زمینه‌ی هیرو یه انیمیشن Canvas از کاراکترهای کد (`{ } [ ] => let const if ...`) داره که مثل بارون از بالا میاد پایین — یادآور صحنه‌های کلاسیک هکری، ولی خیلی ملایم و کم‌کنتراست که حواس‌پرت‌کننده نباشه.
- **کارت‌ها و شیشه‌ای‌بودن (Glassmorphism سبک):** کارت پروژه‌ها، فرم‌ها و پنل ادمین همه از یک زبان مشترک استفاده می‌کنن: پس‌زمینه‌ی نیمه‌تیره، بوردر ظریف بنفش‌رنگ، سایه‌ی نرم گرادینتی، و یه نوار باریک گرادینت بالای هر کارت.
- **حرکت و زنده‌بودن:** به‌جای انیمیشن‌های شلوغ، از حرکت‌های ظریف استفاده شده — هاور روی دکمه‌ها کمی بالا میاد، کارت‌ها موقع اسکرول با فید+ترانسلیت وارد صفحه می‌شن (Intersection Observer)، و مودال ورود/ثبت‌نام یه آواتار با پالس نرم و دو تا حباب نوری شناور پشت خودش داره تا حس سردی و خشکی فرم‌های معمولی رو نداشته باشه.
- **تایپوگرافی:** `Vazirmatn` برای فارسی و `Inter` برای انگلیسی (متن‌ها)، و `JetBrains Mono` برای هرجایی که حس کد/تکنیکال میخواستم (تگ پروژه‌ها، تاریخ‌ها، پنل ادمین).
- **دوزبانه‌ی واقعی:** جهت صفحه (RTL/LTR)، فونت، و حتی چیدمان بعضی description(مثل منوی پنل ادمین) بر اساس زبان انتخابی عوض میشه، نه فقط ترجمه‌ی متن.
- **موبایل‌فرست در عمل:** منو با burger جمع میشه، گرید پروژه‌ها و آمار روی موبایل تک‌ستونی میشن، و پنل ادمین روی صفحه‌های کوچیک سایدبار رو افقی می‌کنه.

---

## فایل‌ها

| فایل | توضیح |
|---|---|
| `index.html` | ساختار اصلی صفحه‌ی سایت |
| `style.css` | تمام استایل‌ها، توکن‌های رنگی و انیمیشن‌ها |
| `script.js` | منطق جاوااسکریپت سایت اصلی (زبان، اسکرول، ورود/ثبت‌نام، چت، پروژه‌های داینامیک) |
| `supabase-config.js` | تنظیمات اتصال به دیتابیس Supabase (باید خودت پرش کنی) |
| `admin.html` / `admin-script.js` | پنل مدیریت خصوصی برای پیام‌ها، پروژه‌ها، چت و آمار بازدید |

---

## نحوه‌ی آپلود روی GitHub Pages

1. یک ریپازیتوری جدید در گیت‌هاب بسازید (یا از ریپازیتوری فعلی استفاده کنید)، مثلاً به نام `portfolio` یا `Zxpmob.github.io`.
2. همه‌ی فایل‌ها (`index.html`, `style.css`, `script.js`, `admin.html`, `admin-script.js`, `supabase-config.js`) را در ریشه‌ی ریپازیتوری آپلود کنید (Add file → Upload files).
3. به مسیر بروید: **Settings → Pages**
4. در قسمت **Source** گزینه‌ی `Deploy from a branch` را انتخاب کنید.
5. برنچ `main` و پوشه‌ی `/root` را انتخاب کرده و روی **Save** بزنید.
6. بعد از چند دقیقه، سایت شما در آدرسی مثل زیر در دسترس خواهد بود:
   `https://zxpmob.github.io/REPO_NAME/`
   (اگر نام ریپازیتوری را `Zxpmob.github.io` بگذارید، سایت مستقیماً روی `https://zxpmob.github.io` بالا می‌آید.)

## سفارشی‌سازی سریع

- برای تغییر متن معرفی یا پروژه‌ها، در `index.html` دنبال `data-fa` و `data-en` بگردید — هر تگ هر دو نسخه‌ی متن را دارد.
- برای تغییر رنگ‌ها، بالای فایل `style.css` بخش `:root` را ویرایش کنید (متغیرهای `--indigo`, `--violet`, `--bg` و غیره).
- پروژه‌های نمونه در بخش `<!-- PROJECTS -->` قرار دارند؛ می‌توانید لینک هرکدام را به ریپازیتوری واقعی خودتان تغییر دهید (یا از پنل ادمین پروژه‌ی واقعی اضافه کنید تا جایگزین نمونه‌ها بشه).

## اطلاعات تماس

ایمیل (`pczxpmob@gmail.com`) و تلگرام (`@Zxpm0b`) واقعی‌ات همه‌جای سایت (دکمه‌های بالای هیرو، ردیف‌های بخش تماس، و `mailto:` در `script.js`) ست شده‌اند.

## نحوه‌ی کار دکمه‌های گیت‌هاب / تلگرام / ایمیل

سه دکمه‌ی دایره‌ای زیر پنل کد در هیرو (و ردیف‌های مشابه در بخش تماس) قرار دارند:
- **گیت‌هاب و تلگرام**: با کلیک، در تب جدید باز می‌شوند.
- **ایمیل**: با کلیک، آدرس ایمیل در کلیپ‌بورد کپی می‌شود.

در هر سه حالت، یک تولتیپ کوچک از پایین به بالا ظاهر می‌شود و پیام تأیید (یا "کپی شد!") را نشان می‌دهد.

## فرم تماس و ورود/ثبت‌نام

وقتی کسی فرم رو پر کنه و بزنه «ارسال پیام»، پیام مستقیم توی دیتابیس Supabase ذخیره می‌شه و بعد توی صفحه‌ی مدیریت (`admin.html`) می‌بینیش. اگه هنوز Supabase رو تنظیم نکرده باشی، به‌جاش برنامه‌ی ایمیل کاربر باز می‌شه (حالت پشتیبان).

فرم ورود/ثبت‌نام روی هیچ فرمت خاصی (زبان، الگوی شماره یا کد ملی) گیر نمی‌ده — کاربر هرچی وارد کنه پذیرفته می‌شه؛ فقط ایمیل و رمز عبور برای ساخت حساب لازمه.

---

## راه‌اندازی پنل مدیریت (Supabase) — قدم‌به‌قدم

### ۱. ساخت پروژه‌ی Supabase (رایگان)
1. برو به [supabase.com](https://supabase.com) → **Start your project** → با گیت‌هاب یا ایمیل ثبت‌نام کن
2. **New Project** بزن، یه اسم بذار (مثلاً `zxpmob-portfolio`)، یه رمز دیتابیس بساز (جایی یادداشتش کن) و منطقه رو انتخاب کن → **Create**
3. چند دقیقه صبر کن تا پروژه ساخته بشه

### ۲. ساخت جدول پیام‌ها
1. از منوی سمت چپ برو به **SQL Editor**
2. یه Query جدید بساز و این کد رو کامل پیست کن و **Run** بزن:

```sql
create table if not exists messages (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  message text not null
);

alter table messages enable row level security;

create policy "Allow public insert"
on messages for insert
to anon
with check (true);

create policy "Allow authenticated read"
on messages for select
to authenticated
using (true);
```

این کار یه جدول می‌سازه و طوری قفلش می‌کنه که: هرکسی می‌تونه پیام ثبت کنه (فرم سایت)، ولی فقط کاربر لاگین‌شده (خودت) می‌تونه پیام‌ها رو بخونه.

### ۳. ساخت اکانت ورود برای خودت
1. برو به **Authentication → Users**
2. **Add user → Create new user**
3. ایمیل و رمز دلخواه خودت رو وارد کن (این جدا از اکانت Supabase خودته — این فقط برای ورود به `admin.html` است)
4. تیک **Auto Confirm User** رو بزن → **Create user**

### ۴. گرفتن کلیدهای اتصال
1. برو به **Settings → API**
2. دو مقدار رو کپی کن: **Project URL** و **anon public** key

### ۵. پر کردن `supabase-config.js`
فایل `supabase-config.js` رو باز کن و این دو خط رو با مقادیر خودت جایگزین کن:
```js
const SUPABASE_URL = "https://xxxxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOi....";
```
این کلید «anon public» امنه که توی کد فرانت‌اند باشه — چون با تنظیمات بالا فقط اجازه‌ی ثبت پیام داره، نه خوندنش.

### ۶. آپلود و استفاده
- همه‌ی فایل‌ها (شامل `admin.html` و `supabase-config.js`) رو مثل قبل توی گیت‌هاب آپلود کن
- بعد از آپلود، برای دیدن پیام‌ها برو به آدرس `https://دامنه‌ی-تو/admin.html` و با ایمیل/رمزی که مرحله‌ی ۳ ساختی وارد شو
- این صفحه لینک از جایی توی سایت اصلی نداره؛ فقط خودت آدرسش رو داری

اگه لازم شد یه پیام رو پاک کنی یا کاربر مدیریت جدید اضافه کنی، هر دو از همون پنل Supabase (بخش Table Editor و Authentication) قابل انجامه.

---

## راه‌اندازی بخش‌های جدید (لاگین مشتری، پروژه‌ها، آمار، تغییر رمز)

این بخش‌ها هم روی همون پروژه‌ی Supabase قبلی سوار می‌شن. کافیه یه Query دیگه توی **SQL Editor** اجرا کنی:

```sql
-- پروفایل مشتری‌ها (اطلاعات ثبت‌نام)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  last_name text,
  phone text,
  national_id text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;

create policy "Users can view own profile"
on profiles for select to authenticated using (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update to authenticated using (auth.uid() = id);

-- ساخت خودکار پروفایل بعد از ثبت‌نام
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, phone, national_id)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'national_id'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- جدول پروژه‌ها (برای بخش «افزودن/حذف پروژه» توی پنل ادمین)
create table if not exists projects (
  id bigint generated by default as identity primary key,
  title text not null,
  description text,
  tags text,
  link text,
  created_at timestamptz default now()
);
alter table projects enable row level security;

create policy "Public can read projects"
on projects for select to anon using (true);

create policy "Authenticated can manage projects"
on projects for all to authenticated using (true) with check (true);

-- جدول بازدید صفحه (برای بخش «آمار» توی پنل ادمین)
create table if not exists page_views (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now(),
  page text
);
alter table page_views enable row level security;

create policy "Public can log a page view"
on page_views for insert to anon with check (true);

create policy "Authenticated can read page views"
on page_views for select to authenticated using (true);
```

### توضیح هر بخش

**لاگین/ثبت‌نام مشتری**
- دکمه‌ی دایره‌ای بالای سایت (کنار دکمه‌ی زبان) — قبل از ورود آیکون آدمک خالی نشون می‌ده، بعد از ورود همون آیکون به‌شکل آواتار پررنگ‌تر می‌مونه
- فرم ثبت‌نام: نام، نام‌خانوادگی، شماره موبایل، کد ملی، ایمیل، رمز عبور — بدون هیچ محدودیت فرمت یا زبانی؛ فقط ایمیل و رمز واقعاً لازمن
- این اطلاعات با ورود کاربر جدید خودکار توی جدول `profiles` ذخیره می‌شه
- به‌طور پیش‌فرض Supabase یه ایمیل تاییدیه می‌فرسته؛ اگه نمی‌خوای این مرحله باشه، برو به **Authentication → Providers → Email** و **Confirm email** رو خاموش کن

**پروژه‌ها (داشبورد ادمین)**
- توی `admin.html`، تب «پروژه‌ها» — همه‌ی پروژه‌های ثبت‌شده لیست می‌شن؛ روی هرکدوم می‌تونی بزنی **ویرایش** (فرم بالا رو با اطلاعات همون پروژه پر می‌کنه) یا **حذف**
- فرم بالای همون تب برای افزودن پروژه‌ی جدیده (عنوان، توضیح، تگ‌ها، لینک)
- هر پروژه‌ای که اضافه کنی، خودکار روی سایت اصلی (بخش «نمونه‌کارها») نمایش داده می‌شه و ۳ نمونه‌ی پیش‌فرض جایگزین می‌شن
- اگه هیچ پروژه‌ای اضافه نکرده باشی، همون ۳ نمونه‌ی قبلی روی سایت می‌مونه

**آمار بازدید**
- هر بار کسی صفحه‌ی اصلی رو باز کنه، یه رکورد توی `page_views` ثبت می‌شه
- توی تب «آمار بازدید» ادمین: کل بازدیدها، بازدید ۲۴ ساعت اخیر، و کل پیام‌ها رو می‌بینی
- این یه شمارنده‌ی ساده‌ست (نه ابزار آنالیتیکس حرفه‌ای)؛ اگه بازم صفر نشون داد:
  1. مطمئن شو Query بخش «آمار بازدید» (که `page_views` رو می‌سازه) رو قبلاً اجرا کرده باشی
  2. مطمئن شو `admin-script.js` هم توی ریپو آپلود شده (این فایل جدا از `admin.html` است)
  3. یه‌بار توی حالت Incognito سایت اصلی رو باز کن (بعضی افزونه‌های adblock درخواست‌های `page_views` رو می‌بلاکن)

**تغییر رمز عبور**
- توی `admin.html`، تب «تغییر رمز» — رمز فعلی‌ات (همونی که برای ورود به پنل استفاده می‌کنی) رو از همینجا عوض می‌کنی، بدون نیاز به رفتن توی Supabase

### درباره‌ی اعتبارسنجی با شماره موبایل (OTP)
این بخش هنوز پیاده نشده چون نیاز به یه سرویس پیامک پولی داره (چون Supabase خودش پیامک نمی‌فرسته، فقط واسطه‌ست). گزینه‌های رایج برای شماره‌های ایران:
- **Kavenegar** یا **SMS.ir** (نیاز به حساب و شارژ)
- بعد از ساخت حساب، باید یه Supabase Edge Function بنویسیم که با کلید اون سرویس کد تایید بفرسته (چون کلید سرویس پیامک نباید توی کد فرانت‌اند/مرورگر باشه)

---

## راه‌اندازی بخش چت (گفتگوی زنده با مشتری‌ها)

یه Query دیگه توی **SQL Editor** اجرا کن:

```sql
-- فلگ ادمین روی پروفایل
alter table profiles add column if not exists is_admin boolean default false;

-- مکالمه‌ها (هر مشتری یک مکالمه با تو داره)
create table if not exists conversations (
  id bigint generated by default as identity primary key,
  customer_id uuid references auth.users on delete cascade not null,
  customer_name text,
  created_at timestamptz default now(),
  last_message_at timestamptz default now()
);
alter table conversations enable row level security;

create policy "View own or admin"
on conversations for select to authenticated
using (
  customer_id = auth.uid()
  or exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create policy "Customer creates own conversation"
on conversations for insert to authenticated
with check (customer_id = auth.uid());

create policy "Admin can update conversations"
on conversations for update to authenticated
using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

-- پیام‌های هر مکالمه
create table if not exists chat_messages (
  id bigint generated by default as identity primary key,
  conversation_id bigint references conversations on delete cascade not null,
  sender text not null check (sender in ('customer','admin')),
  message text not null,
  created_at timestamptz default now()
);
alter table chat_messages enable row level security;

create policy "Participants can view messages"
on chat_messages for select to authenticated
using (
  exists (
    select 1 from conversations c
    where c.id = conversation_id
    and (c.customer_id = auth.uid() or exists (select 1 from profiles where id = auth.uid() and is_admin = true))
  )
);

create policy "Participants can send messages"
on chat_messages for insert to authenticated
with check (
  exists (
    select 1 from conversations c
    where c.id = conversation_id
    and (c.customer_id = auth.uid() or exists (select 1 from profiles where id = auth.uid() and is_admin = true))
  )
);

-- فعال‌کردن آپدیت زنده (Realtime) برای پیام‌ها
alter publication supabase_realtime add table chat_messages;
```

### مهم‌ترین قدم: خودت رو ادمین کن
با کوئری زیر (فقط ایمیلی که برای ورود به `admin.html` استفاده می‌کنی رو جایگزین کن)، حساب خودت رو ادمین می‌کنی — بدون این قدم، بخش چت ادمین هیچ مکالمه‌ای نمی‌بینه:

```sql
insert into profiles (id, first_name, is_admin)
select id, 'Admin', true from auth.users where email = 'ایمیل-ادمین-خودت@example.com'
on conflict (id) do update set is_admin = true;
```

### چطور کار می‌کنه (فلوی جدید: درخواست → تایید → چت)
- توی سایت اصلی، بخش «بیایید صحبت کنیم» یه پنل چنددرحالته‌ست:
  1. کاربر وارد نشده → دکمه‌ی ورود/ثبت‌نام می‌بینه
  2. بعد از ورود، اگه اولین‌باره → فرم «توضیح پروژه یا درخواست همکاری» رو می‌بینه (نه چت مستقیم)
  3. بعد از ارسال درخواست → پیام «در حال بررسی» می‌بینه و نمی‌تونه پیام دیگه‌ای بده
  4. توی `admin.html` تب «چت» → درخواست رو می‌بینی با دو دکمه‌ی **تایید** و **رد کن**
  5. اگه تایید کنی → چت زنده‌ی کامل برای هر دو طرف باز می‌شه (آنی/Realtime، بدون رفرش)
  6. اگه رد کنی → کاربر یه پیام مودبانه می‌بینه و دیگه نمی‌تونه پیام بده
- هر کاربر فقط یک درخواست/مکالمه با تو داره

یه Query دیگه هم لازمه (این جدول‌های چت قبلی رو کامل می‌کنه):

```sql
-- ستون‌های جدید روی conversations
alter table conversations add column if not exists status text not null default 'pending' check (status in ('pending','approved','rejected'));
alter table conversations add column if not exists initial_message text;

-- بازنویسی policy درج مکالمه: فقط با وضعیت pending ساخته بشه
drop policy if exists "Customer creates own conversation" on conversations;
create policy "Customer creates own conversation"
on conversations for insert to authenticated
with check (customer_id = auth.uid() and status = 'pending');

-- بازنویسی policy ارسال پیام: فقط وقتی مکالمه approved باشه
drop policy if exists "Participants can send messages" on chat_messages;
create policy "Participants can send messages"
on chat_messages for insert to authenticated
with check (
  exists (
    select 1 from conversations c
    where c.id = conversation_id
    and c.status = 'approved'
    and (c.customer_id = auth.uid() or exists (select 1 from profiles where id = auth.uid() and is_admin = true))
  )
);

-- فعال‌کردن آپدیت زنده روی conversations (تا وضعیت approve/reject آنی به کاربر برسه)
alter publication supabase_realtime add table conversations;
```

⚠️ اگه قبلاً Query جدول‌های چت (`conversations`, `chat_messages`) رو اجرا کرده بودی، این Query جدید رو **هم** باید اجرا کنی — این یکی چیزهای جدید (وضعیت pending/approved/rejected) رو اضافه می‌کنه، جایگزین قبلی نیست.

## پنل ادمین: دو زبانه + چیدمان عمودی

`admin.html` یه دکمه‌ی تغییر زبان (FA/EN) داره. منوی بخش‌ها (پیام‌ها، چت، پروژه‌ها، آمار، تنظیمات) آیکون‌دار و به‌صورت ستونی کنار محتواست: برای فارسی سمت راست، برای انگلیسی خودکار میره سمت چپ.

---

## لایسنس

این پروژه شخصیه؛ برای استفاده یا فورک کردن، فقط بهم اطلاع بده یا کردیت بده 🙂
