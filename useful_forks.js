// XHR helpers
function onreadystatechangeFactory(xhr, successFn) {
    return function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                successFn();
            } else if (xhr.status === 403) {
                console.warn('Looks like the rate-limit was exceeded.');
            } else {
                console.warn('GitHub API returned status:', xhr.status);
            }
        } else {
            // Request is still in progress
        }
    };
}

function run_xhr_get(url, success_callback) {
    let xhr_req = new XMLHttpRequest();
    xhr_req.onreadystatechange = onreadystatechangeFactory(
        xhr_req,
        function () {
            success_callback(JSON.parse(xhr_req.responseText));
        }
    );
    xhr_req.open('GET', url);
    xhr_req.send();
}

// SVGs and CSS
const svg_literal_fork = '<svg class="octicon octicon-repo-forked v-align-text-bottom" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 1a1.993 1.993 0 00-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 002 1a1.993 1.993 0 00-1 3.72V6.5l3 3v1.78A1.993 1.993 0 005 15a1.993 1.993 0 001-3.72V9.5l3-3V4.72A1.993 1.993 0 008 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>';

const svg_literal_star = '<svg aria-label="star" height="16" class="octicon octicon-star v-align-text-bottom" viewBox="0 0 14 16" version="1.1" width="14" role="img"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>';

const svg_literal_eye = '<svg class="octicon octicon-eye v-align-text-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>';

const svg_literal_commit_sign = '<svg class="octicon octicon-history text-gray" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z"></path></svg>';

const additional_css_literal = `
#useful_forks_wrapper .repo div {
    display: inline-block;
    color: var(--color-text-primary);
    text-align:left;
}
#useful_forks_wrapper .repo { margin: 5px 0; }
#useful_forks_wrapper .repo div.useful_forks_link { min-width: 300px; }
#useful_forks_wrapper .usef_btn_part {
    border: 1px solid #eee;
    border-radius: 6px;
    background-color: var(--color-btn-bg);
    border-color: var(--color-btn-border);
    box-shadow: var(--color-btn-shadow),var(--color-btn-shadow-highlight);
    margin: 0;
    padding: 1px 3px;
    cursor:default;
}
#useful_forks_wrapper .usef_btn_part.usef_btn_lhs {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
#useful_forks_wrapper .usef_btn_part.usef_btn_cnt {
    border-radius: 0;
    padding: 1px 5px;
    background-color: var(--color-social-count-bg);
    border-left: 0;
    min-width: 40px;
    text-align: center;
    color: var(--color-text-primary);
}
#useful_forks_wrapper .usef_btn_part.usef_btn_rhs {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    padding: 1px 5px;
    background-color: var(--color-social-count-bg);
    border-left: 0;
    margin-right: 10px;
    min-width: 40px;
    text-align: center;
    color: var(--color-text-primary);
}
`;

function build_single_button(svg_lhs, text_rhs)
{
    return `<div class="usef_btn_part usef_btn_lhs">${svg_lhs}</div><div class="usef_btn_part usef_btn_rhs">${text_rhs}</div>`;
}

function build_fork_element_html(index, combined_name, num_stars, num_watches, num_forks)
{
    return `<div class="repo" id="useful_forks_repo_${index}"><div class="useful_forks_link">${svg_literal_fork}  <a href="/${combined_name}">${combined_name}</a></div><div class="useful_forks_info">${build_single_button(svg_literal_star,num_stars)} ${build_single_button(svg_literal_eye, num_watches)} ${build_single_button(svg_literal_fork, num_forks)}</div><div class="useful_works_compare"></div></div>`;
}

function amend_fork_compare_data(index, comparedata, branch_name, origin_branch_name)
{
    let repo_wrapper = document.getElementById('useful_forks_repo_' + index);
    if (!repo_wrapper)
    {
        console.warn("[useful_forks] failed to find wrapper for repo " + index);
    }

    let compare_wrapper = repo_wrapper.getElementsByClassName('useful_works_compare');
    if (!compare_wrapper || !compare_wrapper[0])
    {
        console.warn("[useful_forks] failed to find useful_works_compare sub-div for repo " + index);
        return;
    }

    const title_text = `${branch_name} is ${comparedata.ahead_by} commits ahead, ${comparedata.behind_by} commits behind of ${origin_branch_name}`;
    const compare_html = `<div class="usef_compareblock" title="${title_text}"><div class="usef_btn_part usef_btn_lhs">${svg_literal_commit_sign}</div><div class="usef_btn_part usef_btn_cnt">+ ${comparedata.ahead_by}</div><div class="usef_btn_part usef_btn_rhs">- ${comparedata.behind_by}</div></div>`;
    compare_wrapper[0].innerHTML = compare_html;
}

function add_fork_elements(forkdata_array, original_user, original_repo)
{
    if (!forkdata_array || forkdata_array.length == 0)
        return;

    let wrapper_html = '<h4>Starred Forks</h4>';
    for (let i = 0; i < Math.min(15, forkdata_array.length); ++i)
    {
        const elem_ref = forkdata_array[i];
        wrapper_html += build_fork_element_html(i, elem_ref.full_name, elem_ref.stargazers_count, elem_ref.watchers_count, elem_ref.forks_count);

        const api_url_compare = elem_ref.compare_url.replace("{base}", `${original_user}:master`).replace("{head}", elem_ref.default_branch);
        run_xhr_get(api_url_compare, function(comparedata_response) {
            amend_fork_compare_data(i, comparedata_response, elem_ref.default_branch, `${original_user}:master`);
        });
    }

    wrapper_html += '<br><br>';
    
    let old_wrapper = document.getElementById('useful_forks_wrapper');
    if (old_wrapper)
    {
        old_wrapper.remove();
    }

    let new_wrapper = document.createElement('div');
    new_wrapper.setAttribute("id", "useful_forks_wrapper");
    new_wrapper.innerHTML = wrapper_html;
    document.getElementById('network').prepend(new_wrapper);
}

function load_useful_forks(user, repo) {
    let styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = additional_css_literal;
    document.head.appendChild(styleSheet);

    const api_url_forks = 'https://api.github.com/repos/' + user + '/' + repo + '/forks?sort=stargazers';
    run_xhr_get(api_url_forks, function(forkdata_response) {
        add_fork_elements(forkdata_response, user, repo);
    });
}

const pathComponents = window.location.pathname.split('/');
if (pathComponents.length >= 3) {
    const user = pathComponents[1], repo = pathComponents[2];
    load_useful_forks(user, repo);
}
