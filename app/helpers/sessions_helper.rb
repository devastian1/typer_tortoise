module SessionsHelper
  def current_user
    @current_user ||= User.find_by_id(session[:user_id])
  end

  def signed_in?
    !!current_user
  end

  def authenticate
    render :text => '' unless signed_in?
  end

  def deny_access
    redirect_to :root
  end

  def sign_in (user)
    @current_user = user
  end

  private

  def current_user=(user)
    @current_user = user
    session[:user_id] = user.nil? ? user : user.id
  end  
end